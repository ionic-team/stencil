import { MockWindow } from './window';


export function setupGlobal(global: any) {
  teardownGlobal(global);

  Object.defineProperty(global, 'window', {
    get() {
      if (global._window == null) {
        global._window = new MockWindow();
      }
      return global._window;
    },
    set(win: any) {
      global._window = win;
    },
    configurable: true
  });

  WINDOW_PROPERTIES.forEach(winProperty => {
    Object.defineProperty(global, winProperty, {
      get() {
        if (global._window == null) {
          global._window = new MockWindow();
        }
        return global._window[winProperty];
      },
      set(val: any) {
        if (global._window == null) {
          global._window = new MockWindow();
        }
        global._window[winProperty] = val;
      },
      configurable: true
    });
  });
}


export function teardownGlobal(global: any) {
  const win = global._window as MockWindow;
  if (win != null) {
    win.$reset();
  }
}


const WINDOW_PROPERTIES = [
  'customElements',
  'dispatchEvent',
  'document',
  'fetch',
  'history',
  'localStorage',
  'location',
  'matchMedia',
  'navigator',
  'performance',
  'removeEventListener',
  'requestAnimationFrame',
  'sessionStorage',
  'CSS',
  'CustomEvent',
  'Event',
  'HTMLElement'
];
