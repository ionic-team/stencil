import { MockWindow, resetWindow } from './window';


export function setupGlobal(global: any) {
  if (global.window == null) {
    const win: any = global.window = new MockWindow();

    WINDOW_FUNCTIONS.forEach(fnName => {
      Object.defineProperty(global, fnName, {
        value() {
          return win[fnName].bind(win);
        },
        configurable: true,
        enumerable: true
      });
    });

    WINDOW_PROPS.forEach(propName => {
      Object.defineProperty(global, propName, {
        get() { return win[propName]; },
        set(val: any) { win[propName] = val; },
        configurable: true,
        enumerable: true
      });
    });
  }

  return global.window;
}


export function teardownGlobal(global: any) {
  const win = global.window as Window;
  resetWindow(win);
}


const WINDOW_FUNCTIONS = [
  'addEventListener',
  'cancelAnimationFrame',
  'cancelIdleCallback',
  'dispatchEvent',
  'fetch',
  'matchMedia',
  'removeEventListener',
  'requestAnimationFrame',
  'requestIdleCallback'
];


const WINDOW_PROPS = [
  'customElements',
  'document',
  'history',
  'localStorage',
  'location',
  'navigator',
  'performance',
  'sessionStorage',
  'CSS',
  'CustomEvent',
  'Event',
  'HTMLElement'
];
