const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
const vm = requireFunc('vm');


export function createHydrateAppSandbox(win: Window) {
  const appScript = loadHydrateAppScript();
  const sandbox = createSandbox(win);
  const context = vm.createContext(sandbox);

  appScript.runInContext(context);

  return sandbox.StencilHydrateApp;
}


let cachedAppScript: any = null;

function loadHydrateAppScript() {
  if (cachedAppScript == null) {
    const fs = requireFunc('fs');
    const path = requireFunc('path');
    const filePath = path.join(__dirname, 'app.js');
    const appCode = fs.readFileSync(filePath, 'utf8');

    const code = `StencilHydrateApp = (exports => {${appCode};return exports; })({});`;

    cachedAppScript = new vm.Script(code, { filename: filePath });
  }

  return cachedAppScript;
}


function createSandbox(win: any) {
  const sandbox: any = {
    __filename: __filename,
    __dirname: __dirname,
    Buffer: Buffer,
    exports: exports,
    fetch: win.fetch,
    global: global,
    module: module,
    process: process,
    require: requireFunc,
    window: win
  };

  WINDOW_PROPS.forEach(prop => {
    if (typeof win[prop] === 'function') {
      Object.defineProperty(sandbox, prop, {
        value() { return win[prop].bind(win); },
        configurable: true,
        enumerable: true
      });

    } else {
      Object.defineProperty(sandbox, prop, {
        get() { return win[prop]; },
        set(val: any) { win[prop] = val; },
        configurable: true,
        enumerable: true
      });
    }
  });

  win.__clearInterval = clearInterval.bind(win);
  win.__clearTimeout = clearTimeout.bind(win);
  win.__setInterval = setInterval.bind(win);
  win.__setTimeout = setTimeout.bind(win);

  return sandbox;
}

const WINDOW_PROPS = [
  'addEventListener',
  'alert',
  'cancelAnimationFrame',
  'cancelIdleCallback',
  'clearInterval',
  'clearTimeout',
  'close',
  'confirm',
  'console',
  'CSS',
  'CustomEvent',
  'customElements',
  'devicePixelRatio',
  'dispatchEvent',
  'Event',
  'document',
  'getComputedStyle',
  'globalThis',
  'history',
  'HTMLElement',
  'innerHeight',
  'innerWidth',
  'localStorage',
  'location',
  'matchMedia',
  'navigator',
  'pageXOffset',
  'pageYOffset',
  'parent',
  'performance',
  'prompt',
  'origin',
  'removeEventListener',
  'requestAnimationFrame',
  'requestIdleCallback',
  'screen',
  'screenLeft',
  'screenTop',
  'screenX',
  'screenY',
  'scrollX',
  'scrollY',
  'self',
  'sessionStorage',
  'setInterval',
  'setTimeout',
  'top',
  'URL'
];

declare const __webpack_require__: Function;
declare const __non_webpack_require__: Function;
