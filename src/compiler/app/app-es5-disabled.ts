import { CompilerCtx, Config } from '../../declarations';
import { getAppWWWBuildDir } from './app-file-naming';
import { pathJoin } from '../util';


export async function generateEs5DisabledMessage(config: Config, compilerCtx: CompilerCtx) {
  // not doing an es5 right now
  // but it's possible during development the user
  // tests on a browser that doesn't support es2015
  const fileName = 'es5-build-disabled.js';

  const filePath = pathJoin(config, getAppWWWBuildDir(config), fileName);
  await compilerCtx.fs.writeFile(filePath, getDisabledMessageScript());

  return fileName;
}


function getDisabledMessageScript() {
  const html = `
  <style>
  body {
    font-family: sans-serif;
    padding: 20px;
    line-height:22px;
  }
  h1 {
    font-size: 18px;
  }
  h2 {
    font-size: 14px;
    margin-top: 40px;
  }
  </style>

  <h1>This app is disabled for this browser.</h1>

  <h2>Developers:</h2>
  <ul>
    <li>ES5 builds are disabled <strong>during development</strong> to take advantage of 2x faster build times.</li>
    <li>Please see the example below or our <a href="https://stenciljs.com/docs/stencil-config" target="_blank">config docs</a> if you would like to develop on a browser that does not fully support ES2015 and custom elements.</li>
    <li>Note that by default, ES5 builds and polyfills are enabled during production builds.</li>
    <li>When testing browsers it is recommended to always test in production mode, and ES5 builds should always be enabled during production builds.</li>
    <li><em>This is only an experiement and if it slows down app development then we will revert this and enable ES5 builds during dev.</em></li>
  </ul>


  <h2>Enabling ES5 builds during development:</h2>
  <pre>
    <code>npm run dev --es5</code>
  </pre>


  <h2>Enabling full production builds during development:</h2>
  <pre>
    <code>npm run dev --prod</code>
  </pre>

  <h2>Current Browser's Support:</h2>
  <ul>
    <li>ES Module Imports: <span id="esModules"></span></li>
    <li>Custom Elements: <span id="customElements"></span></li>
    <li>fetch(): <span id="fetch"></span></li>
    <li>CSS Variables: <span id="cssVariables"></span></li>
  </ul>

  <h2>Current Browser:</h2>
  <pre>
    <code id="currentBrowser"></code>
  </pre>
  `;

  const script = `
    document.body.innerHTML = '${html.replace(/\r\n|\r|\n/g, '').replace(/\'/g, `\\'`).trim()}';

    document.getElementById('currentBrowser').textContent = window.navigator.userAgent;
    document.getElementById('esModules').textContent = !!('noModule' in document.createElement('script'));
    document.getElementById('customElements').textContent = !!(window.customElements);
    document.getElementById('fetch').textContent = !!(window.fetch);
    document.getElementById('cssVariables').textContent = !!(window.CSS && window.CSS.supports && window.CSS.supports('color', 'var(--c)'));
  `;

  // timeout just to ensure <body> is ready
  return `setTimeout(function(){ ${script} }, 10)`;
}
