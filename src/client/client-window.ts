import * as d from '../declarations';
import { BUILD } from '@build-conditionals';


export const win = window;

export const doc = document;

export const plt: d.PlatformRuntime = {
  $flags$: 0,
  $resourcesUrl$: '/'
};

if (BUILD.taskQueue) {
  plt.$resourcesUrl$ = '/';
}

export const supportsShadowDom = (BUILD.shadowDom) ? !!doc.documentElement.attachShadow : false;

export const supportsListenerOptions = /*@__PURE__*/(() => {
  let supportsListenerOptions = false;
  try {
    doc.addEventListener('e', null,
      Object.defineProperty({}, 'passive', {
        get() { supportsListenerOptions = true; }
      })
    );
  } catch (e) {}
  return supportsListenerOptions;
})();


export const supportsConstructibleStylesheets = BUILD.constructibleCSS ? /*@__PURE__*/(() => {
  try {
    new CSSStyleSheet();
    return true;
  } catch (e) {}
  return false;
})() : false;
