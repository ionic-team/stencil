import { IonicGlobal } from '../../util/interfaces';
import { Window } from './window';


export function generateGlobalContext(win: Window, IonicGbl: IonicGlobal) {
  const context: any = {
    'Ionic': IonicGbl,
    'window': win,
    'document': win.document,
    'localStorage': win.localStorage,
    'sessionStorage': win.sessionStorage,
    'location': win.location,
    'navigator': win.navigator,
    'performance': win.performance,
    'setTimeout': win.setTimeout,
    'clearTimeout': win.clearTimeout,
    'setInterval': win.setInterval,
    'clearInterval': win.clearInterval,
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

  return context;
}
