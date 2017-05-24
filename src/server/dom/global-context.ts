import { Window } from './window';


export function generateGlobalContext(win: Window, IonicGbl: any) {
  return {
    'Ionic': IonicGbl,
    'window': win,
    'document': win.document,
    'localStorage': win.localStorage,
    'sessionStorage': win.sessionStorage,
    'location': win.location,
    'navigator': win.navigator,
    'performance': win.performance,
    'requestAnimationFrame': win.requestAnimationFrame,
    'cancelAnimationFrame': win.cancelAnimationFrame,
    'requestIdleCallback': win.requestIdleCallback,
    'cancelIdleCallback': win.cancelIdleCallback,
    'fetch': win.fetch,
    'XMLHttpRequest': win.XMLHttpRequest,
    'screen': win.screen,
    'alert': win.alert,
    'confirm': win.confirm,
    'prompt': win.prompt,
    'print': win.print,
    'focus': win.focus,
    'blur': win.blur,
    'postMessage': win.postMessage,
    'addEventListener': win.addEventListener,
    'removeEventListener': win.removeEventListener,
    'dispatchEvent': win.dispatchEvent,
  };
}
