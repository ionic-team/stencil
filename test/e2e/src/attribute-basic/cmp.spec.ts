
`
<button class='test'>
  Test
</button>


<attribute-basic
  single="single"
  multi-word="multiWord"
  my-custom-attr="customAttr"
  class="results1"></attribute-basic>


<script>
  function update() {
    var elm = document.querySelector('attribute-basic');

    elm.setAttribute('single', 'single-update');
    elm.setAttribute('multi-word', 'multiWord-update');
    elm.setAttribute('my-custom-attr', 'customAttr-update');
  }

  document.querySelector('.test').addEventListener('click', update);
</script>
`
