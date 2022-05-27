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
      value: function assign(target: any) {
        const to = Object(target);

        for (let index = 1; index < arguments.length; index++) {
          const nextSource = arguments[index];
          if (nextSource != null) {
            for (const nextKey in nextSource) {
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
