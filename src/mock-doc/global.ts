import { MockWindow } from './window';


export function applyWindowToGlobal(global: any) {
  global._window = null;

  Object.defineProperty(global, 'window', {
    get: function() {
      if (!this._window) {
        this._window = new MockWindow();
      }
      return this._window;
    }
  });

  WINDOW_PROPERTIES.forEach(winProperty => {
    Object.defineProperty(global, winProperty, {
      get: function() {
        if (!this._window) {
          this._window = new MockWindow();
        }
        return this._window[winProperty];
      }
    });
  });
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
  'Event',
  'CustomEvent'
];
