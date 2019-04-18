import vm from 'vm';
import fs from 'fs';
import path from 'path';


export function getHydrateAppSandbox(win: Window) {
  const appScript = loadAppScript();
  const sandbox = createSandbox(win);
  const context = vm.createContext(sandbox);

  appScript.runInContext(context);

  return sandbox.StencilHydrateApp;
}


let cachedScript: any = null;

function loadAppScript() {
  if (cachedScript != null) {
    return cachedScript;
  }

  const filePath = path.join(__dirname, 'app.js');
  const appCode = fs.readFileSync(filePath, 'utf8');

  const code = `StencilHydrateApp = (exports => {${appCode}\n;return exports; })({});`;

  cachedScript = new vm.Script(code, { filename: filePath });

  return cachedScript;
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
    require: require,
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
