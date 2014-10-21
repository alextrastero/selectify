# selectify
## jQuery plugin to customize selects
### Usage

You can individualy style a dropdown:
```HTML
<select name='lang' id='any-select'>
  <option value='-'>Language</option>
  <option value='en'>English</option>
  <option value='es'>Spanish</option>
  <option value='fr'>French</option>
  <option value='de'>German</option>
</select>
```
```JAVASCRIPT
$('#any-select').selectify();
```

Or, selectify an entire form:
```HTML
<form action="POST" id="any-form" name="new-account">
  <select name='lang' id='any-select'>
    <option value='-'>Language</option>
    <option value='en'>English</option>
    <option value='es'>Spanish</option>
    <option value='fr'>French</option>
    <option value='de'>German</option>
  </select>
</form>
```
```JAVASCRIPT
$('#any-form').selectify();
```