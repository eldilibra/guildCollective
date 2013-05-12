var inputs = document.getElementsByTagName('input');
var inputArr = []
for (var i = 0; i < inputs.length; i++) {
  inputArr.push(inputs[i]);
}

inputArr.forEach(function inputForEach (input) {
  input.addEventListener('focus', function focus (e) {
    if (this.tagName = 'input') {
      this.value = '';
      this.removeEventListener('focus', focus);
    }
  });
});
