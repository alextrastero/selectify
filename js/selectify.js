(function($){

  $.fn.selectify = function( options ){

    var settings = $.extend({
      width: 96,
      disabled: false,
      checkbox: false,
      form: false
    }, options);

    init(this);
    clickAnywhereToClose();

    function init(el){
      if(settings.form){
        if ($(el).is('form')) {
          $(el).find('select').each(function(index, select) {
            buildSelect(select);
          });
          resetTabIndexes(el);
        }
      }else{
        buildSelect(el);
      }
    }

    function buildSelect(el){
      createStructure(el);
      createHeader(el);
      createListElems(el);
      initEventHandler(el);
    }

    function resetTabIndexes(arg){
      var elems = $(arg).find('.selectify-header, input');
      var i = 1;
      $(elems).each(function(index, el) {
        if ( !$(el).hasClass('disabled') ){
          $(el).prop("tabindex", i);
          i++;
        }
      });
    }

    // function buildCheckboxes() {
    //   var elems = $('.bv-select input[type="checkbox"]');
    //   $(elems).each(function(index, el) {
    //     var bvBox = $('<div />').addClass('bv-box ' + $(el).attr('id'))
    //     if( $(el).prop('checked') ) {
    //       $(bvBox).addClass('active');
    //     }
    //     $(el).css({'position': 'absolute','left': '-9999px'});
    //     $(el).after(bvBox);
    //   });

    //   $(elems).change(function(event) {
    //     var box = $(this).next('.bv-box');
    //     if( $(this).prop("checked") ) {
    //       $(box).addClass('active');
    //     }else{
    //       $(box).removeClass('active')
    //     }
    //   });
    //   return elems.length + ' checkboxes modified';
    // }

    function createStructure(el){
      var newSelect = $('<div />').addClass('selectify');
      $(el).before(newSelect);
      $(el).hide();
    }

    function createHeader(el){
      var selectedOpt = $(el).children('option[selected]');
      if (selectedOpt.size() < 1) {
        selectedOpt = $(el).children().first();
      };
      var title = $(selectedOpt).html();
      var header = $('<div />').addClass('selectify-header').text( title );
      $(header).css('width', settings.width);
      $(el).prev('.selectify').append(header)
    }

    function createListElems(el){
      var target = $(el).prev('.selectify');
      var ul = $('<ul />').addClass('selectify-list').appendTo(target)
      $(ul).css('width', settings.width+10);
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

    function clickAnywhereToClose(){
      $('html').click(function(ev) {
        var target = ev.target;
        if(!$(target).hasClass('selectify-header') &&
          !$(target).hasClass('selectify-list') && 
          !$(target).parent().hasClass('selectify-list')){
          hideAll();
        }
      });
      $('input').focus(function(event) {
        hideAll();
      });
    }

    function initKeyHandler(header){
      $(header).unbind('keydown');
      $(header).bind('keydown', function(event) {
        var keyCode = event.keyCode || event.which;
        var list = $(header).next('.selectify-list');
        var select = $(header).parent().next('select');//!
        switch (keyCode) {
          case 38:// up
            event.preventDefault();
            navigateOpts(list, 'up');
            break;
          case 40:// down
            event.preventDefault();
            navigateOpts(list, 'down');
            break;
          case 13:// enter
            event.preventDefault();
            if( isExpanded(list) ) {
              selectNewOption($(list).children('.active'), header);
              hideAll();
            }
            break;
          case 9:// tab
            if( isExpanded(list) ) {
              selectNewOption($(list).children('.active'), header);
              hideAll();
            }
            break;
          case 27:// esc
            event.preventDefault();
            if( isExpanded(list) ) {
              selectNewOption($(list).children('.active'), header);
              hideAll();
            }
            break;
        }
      });
    }

    function cleanUpSelect(select) {//method to rebuild list
      $(select).prev('.selectify').children('.selectify-list').html("");
      var options = $(select).children();
      for (var i = 0; i < $(options).length; i++) {
        var newLi = $('<li />').text( $(options[i]).html() );
        if( $(options[i]).prop('selected') ){
          $(newLi).addClass('active');
          $(select).prev('.selectify').children('.selectify-header').html($(newLi).html())
        }
        $(select).prev('.selectify').children('.selectify-list').append(newLi);
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
      var header = $(list).siblings('.selectify-header');
      if(dir == 'up' && currentIndex > minIndex) {
        currentIndex--;
        selectNewOption(listElems[currentIndex])
      }
      if(dir == 'down' && currentIndex <= maxIndex) {
        currentIndex++;
        selectNewOption(listElems[currentIndex])
      }
    }


    function scrollToActive (list){
      var height = $(list).children().first().height();
      $(list).scrollTop(height * $(list).children('.active').index());
    }

    function showList(list){
      hideAll();
      $(list).addClass('expanded');
      $(list).show();
      scrollToActive(list);
    }
    function initEventHandler(select){
      var target = $(select).prev('.selectify');
      var header = $(target).children('.selectify-header');
      var list = $(target).children('.selectify-list');
      if( $(select).prop('disabled') ){
        $(header).addClass('disabled');
        return false;
      }
      $(header).click(function(event) {
        if(!isExpanded(list)){
          showList(list);
        }
      });
      $(header).focus(function(event) {
        // issue is header not receiving focus WTF!!!!!!!!!!!!!!!!!!!!!!!!!
        if(!isExpanded(list)){
          showList(list);
        }
      });
      $(list).children().click(function(event) {
        selectNewOption(this, header);
        $(list).prev('.selectify-header').focus();
        setTimeout(function(){hideAll();}, 1);
      });
      initKeyHandler(header);
    }

    function hideAll(){
      $('.selectify-list').each(function(index, el) {
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
      var selOptions = $(el).parents('.selectify').next('select').children();
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
}(jQuery));