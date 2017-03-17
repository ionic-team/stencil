import { getStaticComponentDir } from '../../../utils/helpers';

const win: any = window;

win.$WebComponentsReadyCallbacks = [];


win.onWebComponentsReady = function(cb: Function) {
  if (win.$WebComponentsReadyCallbacks) {
    win.$WebComponentsReadyCallbacks.push(cb);
  } else {
    cb();
  }
}


window.addEventListener('WebComponentsReady', function WebComponentsReady() {
  win.$WebComponentsReadyCallbacks.forEach(cb => {
    cb();
  });
  delete win.$WebComponentsReadyCallbacks;
});


const staticDir = getStaticComponentDir(document);

if (!win.customElements || win.customElements.forcePolyfill) {
  const polyfillScript = document.createElement('script');
  polyfillScript.src = staticDir + 'webcomponents-ce.js';
  document.head.appendChild(polyfillScript);

} else {
  requestAnimationFrame(() => {
    win.dispatchEvent(new CustomEvent('WebComponentsReady'));
  });
}
