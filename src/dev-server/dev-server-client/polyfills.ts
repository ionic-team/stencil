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
    Object.defineProperty(Object, "assign", {
      value: function assign(target: any) {
        var to = Object(target);
  
        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];
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
      configurable: true
    });
  }
}
