

export const HYDRATE_FACTORY_INTRO = `
export function hydrateFactory(win, opts, results, afterHydrate, resolve) {
  var globalThis = win;
  var self = win;
  var top = win;
  var parent = win;

  var addEventListener = win.addEventListener.bind(win);
  var alert = win.alert.bind(win);
  var blur = win.blur.bind(win);
  var cancelAnimationFrame = win.cancelAnimationFrame.bind(win);
  var cancelIdleCallback = win.cancelIdleCallback.bind(win);
  var clearInterval = win.clearInterval.bind(win);
  var clearTimeout = win.clearTimeout.bind(win);
  var close = () => {};
  var confirm = win.confirm.bind(win);
  var dispatchEvent = win.dispatchEvent.bind(win);
  var focus = win.focus.bind(win);
  var getComputedStyle = win.getComputedStyle.bind(win);
  var matchMedia = win.matchMedia.bind(win);
  var open = win.open.bind(win);
  var prompt = win.prompt.bind(win);
  var removeEventListener = win.removeEventListener.bind(win);
  var requestAnimationFrame = win.requestAnimationFrame.bind(win);
  var requestIdleCallback = win.requestIdleCallback.bind(win);
  var setInterval = win.setInterval.bind(win);
  var setTimeout = win.setTimeout.bind(win);

  var CSS = win.CSS;
  var CustomEvent = win.CustomEvent;
  var Element = win.Element;
  var Event = win.Event;
  var HTMLElement = win.HTMLElement;
  var IntersectionObserver = win.IntersectionObserver;
  var KeyboardEvent = win.KeyboardEvent;
  var MouseEvent = win.MouseEvent;
  var Node = win.Node;
  var NodeList = win.NodeList;
  var URL = win.URL;

  var console = win.console;
  var customElements = win.customElements;
  var history = win.history;
  var localStorage = win.localStorage;
  var location = win.location;
  var navigator = win.navigator;
  var performance = win.performance;
  var sessionStorage = win.sessionStorage;

  var devicePixelRatio = win.devicePixelRatio;
  var innerHeight = win.innerHeight;
  var innerWidth = win.innerWidth;
  var origin = win.origin;
  var pageXOffset = win.pageXOffset;
  var pageYOffset = win.pageYOffset;
  var screen = win.screen;
  var screenLeft = win.screenLeft;
  var screenTop = win.screenTop;
  var screenX = win.screenX;
  var screenY = win.screenY;
  var scrollX = win.scrollX;
  var scrollY = win.scrollY;
  var exports = {};

  function hydrateAppClosure(window) {
    var document = window.document;
`;

export const HYDRATE_FACTORY_OUTRO = `
    hydrateApp(window, opts, results, afterHydrate, resolve);
  }

  hydrateAppClosure(win);
}
`;
