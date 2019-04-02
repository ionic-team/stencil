

export function applyPolyfills(win: any) {
  applyCustomEvent(win);
}


function applyCustomEvent(win: any) {
  if (typeof win.CustomEvent === 'function') {
    return;
  }

  function CustomEvent(event: any, params: any) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    const evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
    }

  CustomEvent.prototype = win.Event.prototype;

  win.CustomEvent = CustomEvent;
}
