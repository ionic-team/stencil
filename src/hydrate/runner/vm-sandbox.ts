
const hydrateAppFileName = '$$HYDRATE_APP_FILENAME$$';
const hydrateAppPackageName = '$$HYDRATE_APP_PACKAGE_NAME$$';


const requireFunc: any = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
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

    let hydrateAppFilePath: string;
    let hydrateAppCode: string;
    try {
      hydrateAppFilePath = path.join(__dirname, hydrateAppFileName);
      hydrateAppCode = fs.readFileSync(hydrateAppFilePath, 'utf8');

    } catch (e) {
      const hydrateAppPackageIndex = requireFunc.resolve(hydrateAppPackageName);
      const hydrateAppPackageDir = path.dirname(hydrateAppPackageIndex);
      hydrateAppFilePath = path.join(hydrateAppPackageDir, hydrateAppFileName);
      hydrateAppCode = fs.readFileSync(hydrateAppFilePath, 'utf8');
    }

    const code = `StencilHydrateApp = (exports => {${hydrateAppCode};return exports; })({});`;

    cachedAppScript = new vm.Script(code, { filename: hydrateAppFilePath });
  }

  return cachedAppScript;
}


export function createSandbox(win: any) {
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
      sandbox[prop] = win[prop].bind(win);

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
