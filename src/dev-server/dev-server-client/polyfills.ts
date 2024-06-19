/* eslint-disable no-var -- shims will continue to use var while we support older browsers */
// TODO(STENCIL-465): Investigate whether we can delete this file
export const applyPolyfills = (win: any) => {
  applyObjectAssign();
  applyCustomEvent(win);
};

const applyCustomEvent = (win: any) => {
  if (typeof win.CustomEvent === 'function') {
    return;
  }

  function CustomEvent(event: any, params: any) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = win.Event.prototype;

  win.CustomEvent = CustomEvent;
};

const applyObjectAssign = () => {
  if (typeof Object.assign !== 'function') {
    Object.defineProperty(Object, 'assign', {
      value: function assign(target: any, ...rest: any[]) {
        var to = Object(target);

        for (var nextSource of rest) {
          if (nextSource != null) {
            for (var nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true,
    });
  }
};
