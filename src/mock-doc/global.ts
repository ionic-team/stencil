import { MockWindow } from './window';


export function setupGlobal(gbl: any) {
  if (gbl.window == null) {
    const win: any = gbl.window = new MockWindow();

    WINDOW_FUNCTIONS.forEach(fnName => {
      if (!(fnName in gbl)) {
        gbl[fnName] = win[fnName].bind(win);
      }
    });

    WINDOW_PROPS.forEach(propName => {
      if (!(propName in gbl)) {
        Object.defineProperty(gbl, propName, {
          get() { return win[propName]; },
          set(val: any) { win[propName] = val; },
          configurable: true,
          enumerable: true
        });
      }
    });
  }

  return gbl.window;
}


export function teardownGlobal(gbl: any) {
  const win = gbl.window as Window;
  if (win && typeof win.close === 'function') {
    win.close();
  }
}


export function patchWindow(winToBePatched: any) {
  const mockWin: any = new MockWindow(false);

  WINDOW_FUNCTIONS.forEach(fnName => {
    if (typeof winToBePatched[fnName] !== 'function') {
      winToBePatched[fnName] = mockWin[fnName].bind(mockWin);
    }
  });

  WINDOW_PROPS.forEach(propName => {
    if (winToBePatched === undefined) {
      Object.defineProperty(winToBePatched, propName, {
        get() { return mockWin[propName]; },
        set(val: any) { mockWin[propName] = val; },
        configurable: true,
        enumerable: true
      });
    }
  });
}


const WINDOW_FUNCTIONS = [
  'addEventListener',
  'cancelAnimationFrame',
  'cancelIdleCallback',
  'dispatchEvent',
  'matchMedia',
  'removeEventListener',
  'requestAnimationFrame',
  'requestIdleCallback',
  'URL'
];


const WINDOW_PROPS = [
  'customElements',
  'devicePixelRatio',
  'document',
  'history',
  'innerHeight',
  'innerWidth',
  'localStorage',
  'location',
  'navigator',
  'pageXOffset',
  'pageYOffset',
  'performance',
  'screenLeft',
  'screenTop',
  'screenX',
  'screenY',
  'scrollX',
  'scrollY',
  'sessionStorage',
  'CSS',
  'CustomEvent',
  'Event',
  'Element',
  'HTMLElement',
  'Node',
  'NodeList',
  'KeyboardEvent',
  'MouseEvent'
];
