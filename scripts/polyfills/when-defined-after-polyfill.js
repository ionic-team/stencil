
if (window.$whenDefined) {
  window.$whenDefined.forEach(function(d) {
    customElements.whenDefined(d[0]).then(function() {
      d[1]();
    });
  });
  delete window.$whenDefined;
}

