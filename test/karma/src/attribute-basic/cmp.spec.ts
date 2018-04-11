function update() {
  var elm = document.querySelector('attribute-basic');

  elm.setAttribute('single', 'single-update');
  elm.setAttribute('multi-word', 'multiWord-update');
  elm.setAttribute('my-custom-attr', 'customAttr-update');
}

document.querySelector('.test').addEventListener('click', update);
