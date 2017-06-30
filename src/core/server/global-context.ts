import { ProjectNamespace } from '../../util/interfaces';


export function generateGlobalContext(win: any, Gbl: ProjectNamespace): any {

  return {

    // injected Ionic Global
    Ionic: Gbl,

    // common
    window: win,
    document: win.document,
    console: win.console,
    fetch: win.fetch,
    location: win.location,
    navigator: win.navigator,
    performance: win.performance,
    screen: win.screen,
    XMLHttpRequest: win.XMLHttpRequest,

    // async callbacks
    cancelAnimationFrame: win.cancelAnimationFrame,
    cancelIdleCallback: win.cancelIdleCallback,
    clearInterval: win.clearInterval,
    clearTimeout: win.clearTimeout,
    requestAnimationFrame: win.requestAnimationFrame,
    requestIdleCallback: win.requestIdleCallback,
    setInterval: win.setInterval,
    setTimeout: win.setTimeout,

    // storage
    localStorage: win.localStorage,
    sessionStorage: win.sessionStorage,

    // noops
    addEventListener: win.addEventListener,
    alert: win.alert,
    atob: win.atob,
    blur: win.blur,
    btoa: win.btoa,
    captureEvents: win.captureEvents,
    close: win.close,
    confirm: win.confirm,
    createImageBitmap: win.createImageBitmap,
    dispatchEvent: win.dispatchEvent,
    find: win.find,
    focus: win.focus,
    getComputedStyle: win.getComputedStyle,
    getMatchedCSSRules: win.getMatchedCSSRules,
    getSelection: win.getSelection,
    matchMedia: win.matchMedia,
    moveTo: win.moveTo,
    moveBy: win.moveBy,
    open: win.open,
    postMessage: win.postMessage,
    print: win.print,
    prompt: win.prompt,
    releaseEvents: win.releaseEvents,
    removeEventListener: win.removeEventListener,
    resizeBy: win.resizeBy,
    resizeTo: win.resizeTo,
    scroll: win.scroll,
    scrollBy: win.scrollBy,
    scrollTo: win.scrollTo,
    stop: win.stop,

  };
}
