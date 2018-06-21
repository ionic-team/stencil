import { CompilerCtx, Config, OutputTarget } from '../../declarations';
import { getAppBuildDir } from './app-file-naming';
import { pathJoin } from '../util';


export async function generateEs5DisabledMessage(config: Config, compilerCtx: CompilerCtx, outputTarget: OutputTarget) {
  // not doing an es5 right now
  // but it's possible during development the user
  // tests on a browser that doesn't support es2017
  const fileName = 'es5-build-disabled.js';

  const filePath = pathJoin(config, getAppBuildDir(config, outputTarget), fileName);
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

  <h1>This Stencil app is disabled for this browser.</h1>

  <h2>Developers:</h2>
  <ul>
    <li>ES5 builds are disabled <strong>during development</strong> to take advantage of 2x faster build times.</li>
    <li>Please see the example below or our <a href="https://stenciljs.com/docs/stencil-config" target="_blank">config docs</a> if you would like to develop on a browser that does not fully support ES2017 and custom elements.</li>
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
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import">ES Module Imports</a>: <span id="es-modules-test"></span></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements">Custom Elements</a>: <span id="custom-elements-test"></span></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">fetch</a>: <span id="fetch-test"></span></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables">CSS Variables</a>: <span id="css-variables-test"></span></li>
  </ul>

  <h2>Current Browser:</h2>
  <pre>
    <code id="current-browser-output"></code>
  </pre>
  `;

  const script = `
    document.body.innerHTML = '${html.replace(/\r\n|\r|\n/g, '').replace(/\'/g, `\\'`).trim()}';

    document.getElementById('current-browser-output').textContent = window.navigator.userAgent;
    document.getElementById('es-modules-test').textContent = !!('noModule' in document.createElement('script'));
    document.getElementById('custom-elements-test').textContent = !!(window.customElements);
    document.getElementById('css-variables-test').textContent = !!(window.CSS && window.CSS.supports && window.CSS.supports('color', 'var(--c)'));
    document.getElementById('fetch-test').textContent = !!(window.fetch);
  `;

  // timeout just to ensure <body> is ready
  return `setTimeout(function(){ ${script} }, 10)`;
}
