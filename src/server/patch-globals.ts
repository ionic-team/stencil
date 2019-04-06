
export function patchNodeGlobal(global: any) {

  if (typeof global.requestAnimationFrame !== 'function') {
    global.requestAnimationFrame = function(cb: Function) {
      return setTimeout(() => {
        cb(Date.now());
      });
    };
  }

  if (typeof global.cancelAnimationFrame !== 'function') {
    global.cancelAnimationFrame = function(id: any) {
      clearTimeout(id);
    };
  }

  if (typeof global.requestIdleCallback !== 'function') {
    global.requestIdleCallback = function(cb: Function) {
      return setTimeout(() => {
        cb({
          didTimeout: false,
          timeRemaining() {
            return 0;
          }
        });
      });
    };
  }

  if (typeof global.cancelIdleCallback !== 'function') {
    global.cancelIdleCallback = function(id: any) {
      clearTimeout(id);
    };
  }

  if (typeof global.matchMedia !== 'function') {
    global.matchMedia = function(media: string) {
      return {
        matches: false,
        media: media
      };
    };
  }

  if (global.performance == null) {
    global.performance = {
      now() {
        return Date.now();
      }
    };
  }

  if (global.HTMLElement == null) {
    global.HTMLElement = class HTMLElement {};
  }

  const WINDOW_FUNCTIONS = [
    'addEventListener',
    'dispatchEvent',
    'removeEventListener'
  ];

  WINDOW_FUNCTIONS.forEach(winKey => {
    patchWindownFunction(global, winKey);
  });

  const WINDOW_OBJECTS = [
    'customElements',
    'document',
    'history',
    'localStorage',
    'location',
    'navigator',
    'sessionStorage',
    'window'
  ];

  WINDOW_OBJECTS.forEach(winKey => {
    patchWindownObject(global, winKey);
  });
}

function patchWindownObject(global: any, winKey: string) {
  if (typeof global[winKey] !== 'object') {
    Object.defineProperty(global, winKey, {
      get() {
        console.warn(`Please use a local window reference when using "${winKey}" while prerendering.`);
        return {};
      }
    });
  }
}

function patchWindownFunction(global: any, winKey: string) {
  if (typeof global[winKey] !== 'function') {
    global[winKey] = function() {
      console.warn(`Please use a local window reference when using "${winKey}" while prerendering.`);
      return {};
    };
  }
}
