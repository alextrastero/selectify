$.fn.selectify = function(){

  var width = 96;
  
  buildSelect(this);

  function resetTabIndexes(arg){
    var selector = '.bv-select input, .bv-select .bv-select-header';
    if(arg){selector += (', ' + arg);}
    $(selector).each(function(index, el) {
      if ( !$(el).hasClass('disabled') ){
        $(el).prop("tabindex", index + 1);
      }
    });
  }

  function buildSelect(el){
    initWindowHandler();
    resetTabIndexes();
    createStructure(el);
    createHeader(el);
    createListElems(el);
    initEventHandler(el);
  }

  function buildCheckboxes() {
    var elems = $('.bv-select input[type="checkbox"]');
    $(elems).each(function(index, el) {
      var bvBox = $('<div />').addClass('bv-box ' + $(el).attr('id'))
      if( $(el).prop('checked') ) {
        $(bvBox).addClass('active');
      }
      $(el).css({'position': 'absolute','left': '-9999px'});
      $(el).after(bvBox);
    });

    $(elems).change(function(event) {
      var box = $(this).next('.bv-box');
      if( $(this).prop("checked") ) {
        $(box).addClass('active');
      }else{
        $(box).removeClass('active')
      }
    });
    return elems.length + ' checkboxes modified';
  }

  function createStructure(el){
    var newSelect = $('<div />').addClass('bv-select-select');
    $(el).before(newSelect);
    $(el).hide();
  }

  function createHeader(el){
    var selectedOpt = $(el).children('option[selected]');
    if (selectedOpt.size() < 1) {
      selectedOpt = $(el).children().first();
    };
    var title = $(selectedOpt).html();
    var header = $('<div />').addClass('bv-select-header').text( title );
    $(header).css('width', width);
    $(el).prev('.bv-select-select').append(header)
  }

  function createListElems(el){
    var target = $(el).prev('.bv-select-select');
    var ul = $('<ul />').addClass('bv-select-list').appendTo(target)
    $(ul).css('width', width+10);
    var options = $(el).children();
    for (var i = 0; i < $(options).length; i++) {
      var newLi = $('<li />').text( $(options[i]).html() );
      if( $(options[i]).prop('selected') )
        $(newLi).addClass('active');
      $(ul).append(newLi);
    };
    $(ul).css({
      'display':'none',
      'position':'absolute',
      'overflow-y':'auto',
      'max-height':'300px',
      'z-index':'666'
    });
  }

  function initWindowHandler(){
    $('html').click(function(ev) {
      var target = ev.target;
      if(!$(target).hasClass('bv-select-header') &&
        !$(target).hasClass('bv-select-list') && 
        !$(target).parent().hasClass('bv-select-list')){
        hideAll();
      }
    });
    $('input').focus(function(event) {
      hideAll();
    });
  }

  function initKeyHandler(header){
    var self = this;
    $(header).unbind('keydown');
    $(header).bind('keydown', function(event) {
      var keyCode = event.keyCode || event.which;
      var list = $(header).next('.bv-select-list');
      var select = $(header).parent().next('select');//!
      switch (keyCode) {
        case 38:// up
          event.preventDefault();
          self.navigateOpts(list, 'up');
          break;
        case 40:// down
          event.preventDefault();
          self.navigateOpts(list, 'down');
          break;
        case 13:// enter
          event.preventDefault();
          if( self.isExpanded(list) ) {
            self.selectNewOption($(list).children('.active'), header);
            hideAll();
          }
          break;
        case 9:// tab
          if( self.isExpanded(list) ) {
            self.selectNewOption($(list).children('.active'), header);
            hideAll();
          }
          break;
        case 27:// esc
          event.preventDefault();
          if( self.isExpanded(list) ) {
            self.selectNewOption($(list).children('.active'), header);
            hideAll();
          }
          break;
      }
    });
  }

  function cleanUpSelect(select) {//method to rebuild list
    $(select).prev('.bv-select-select').children('.bv-select-list').html("");
    var options = $(select).children();
    for (var i = 0; i < $(options).length; i++) {
      var newLi = $('<li />').text( $(options[i]).html() );
      if( $(options[i]).prop('selected') ){
        $(newLi).addClass('active');
        $(select).prev('.bv-select-select').children('.bv-select-header').html($(newLi).html())
      }
      $(select).prev('.bv-select-select').children('.bv-select-list').append(newLi);
    };
  }

  function navigateOpts (list, dir){
    if (!isExpanded(list)) {
      showList(list);
    };
    var listElems = $(list).children();
    var activeElem = $(list).children('.active');
    var currentIndex = $(activeElem).index();
    var maxIndex = $(listElems).size();
    var minIndex = 0;
    var header = $(list).siblings('.bv-select-header');
    if(dir == 'up' && currentIndex > minIndex) {
      currentIndex--;
      selectNewOption(listElems[currentIndex])
    }
    if(dir == 'down' && currentIndex <= maxIndex) {
      currentIndex++;
      selectNewOption(listElems[currentIndex])
    }
  }

  function showList(list){
    hideAll();
    $(list).addClass('expanded');
    $(list).show();
    scrollToActive(list);
  }

  function scrollToActive (list){
    var height = $(list).children().first().height();
    $(list).scrollTop(height * $(list).children('.active').index());
  }

  function initEventHandler(select){
    var target = $(select).prev('.bv-select-select');
    var header = $(target).children('.bv-select-header');
    var list = $(target).children('.bv-select-list');

    var isDisabled = $(select).prop('disabled');
    if( isDisabled ){
      $(header).addClass('disabled');
      return false;
    }
    $(header).click(function(event) {
      if(!isExpanded(list)){
        showList(list);
      }
    });
    $(header).focus(function(event) {
      if(!isExpanded(list)){
        showList(list);
      }
    });
    $(list).children().click(function(event) {
      selectNewOption(this, header);
      $(list).prev('.bv-select-header').focus();
      setTimeout(function(){hideAll();}, 1);
    });

    initKeyHandler(header);
  }

  function hideAll(){
    $('.bv-select-list').each(function(index, el) {
      $(el).removeClass('expanded').hide();
    });
  }

  function isExpanded (list){
    if($(list).hasClass('expanded')){
      return true;
    }else{
      return false;
    }
  }



  function selectNewOption(el, header){
    // set as active
    $(el).siblings('li').removeClass('active');
    $(el).addClass('active');
    scrollToActive($(el).parent());
    // change element in select
    var selOptions = $(el).parents('.bv-select-select').next('select').children();
    var index = $(el).index();
    var opt = selOptions[index];
    $(opt).prop('selected', 'selected');
    $(opt).trigger('change');
    // update header if provided
    if(header){
      $(header).html($(opt).html());
    }
  }
};