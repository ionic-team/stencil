import { MockWindow } from './window';


export function setupGlobal(global: any) {
  if (global.window == null) {
    global.window = new MockWindow();

    WINDOW_PROPERTIES.forEach(winProperty => {
      Object.defineProperty(global, winProperty, {
        get() {
          return global.window[winProperty];
        },
        set(val: any) {
          global.window[winProperty] = val;
        },
        configurable: true
      });
    });
  }

  return global.window;
}


export function teardownGlobal(global: any) {
  const win = global.window as MockWindow;
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
