var submit = document.getElementsByClassName('submit')[0];
var form = document.getElementsByTagName('form')[0];

submit.addEventListener('click', function submitForm () {
  document.forms[form.name].submit();
});
