Selectify.js is a jquery plugin that converts your SELECT tags into DIV tags allowing you to style them as you please.
# Setup
### 1. Include jQuery
```JAVASCRIPT
<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
```
### 2. Include Selectify.js
```JAVASCRIPT
<script src="jquery.selectify.js"></script>
```
### 3. Markup
Link to a basic theme (optional)
```HTML
<link rel="stylesheet" href="theme/basic.css">
```
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
  <select name='day' id='dobday'>
    <option value='0'>Day</option>
    <option value='1'>Monday</option>
    <option value='2'>Tuesday</option>
    <option value='3'>Wednesday</option>
    <option value='4'>...</option>
  </select>
  <select name='month' id='dobmonth'>
    <option value='0'>Month</option>
    <option value='1'>January</option>
    <option value='2'>February</option>
    <option value='3'>March</option>
    <option value='4'>...</option>
  </select>
  <select name='year' id='dobyear'>
    <option value='0'>Year</option>
    <option value='1'>1984</option>
    <option value='2'>1985</option>
    <option value='3'>1986</option>
    <option value='4'>...</option>
  </select>
</form>
```
```JAVASCRIPT
$('#any-form').selectify();
```
