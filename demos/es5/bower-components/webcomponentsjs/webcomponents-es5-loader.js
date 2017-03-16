/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function() {
  'use strict';
  var name = 'webcomponents-es5-loader.js';
  // Feature detect which polyfill needs to be imported.
  var polyfills = [];
  if (!('import' in document.createElement('link'))) {
    polyfills.push('hi');
  }
  if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype) ||
    (window.ShadyDOM && window.ShadyDOM.force)) {
    polyfills.push('sd');
  }
  if (!window.customElements || window.customElements.forcePolyfill) {
    polyfills.push('ce');
  } else {
    polyfills.push('ce-es5');
  }
  if (!('content' in document.createElement('template')) || !window.Promise ||
    // Edge has broken fragment cloning which means you cannot clone template.content
    !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment)) {
    polyfills.push('pf');
  }

  if (polyfills.length === 4) { // hi-ce-sd-pf is actually called lite.
    polyfills = ['lite'];
  }

  if (polyfills.length) {
    var script = document.querySelector('script[src*="' + name + '"]');
    var newScript = document.createElement('script');
    // Load it from the right place.
    var replacement = 'webcomponents-' + polyfills.join('-') + '.js';
    var url = script.src.replace(name, replacement);
    newScript.src = url;
    document.head.appendChild(newScript);
  } else {
    // Ensure `WebComponentsReady` is fired also when there are no polyfills loaded.
    requestAnimationFrame(function() {
      window.dispatchEvent(new CustomEvent('WebComponentsReady'));
    });
  }
})();
