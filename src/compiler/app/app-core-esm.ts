import * as d from '../../declarations';
import { buildCoreContent } from './build-core-content';
import { generatePreamble } from '../util';
import { getCoreEsmBuildPath, getGlobalEsmFileName } from './app-file-naming';
import { generateAppGlobalScript } from './app-global-scripts';
import { setBuildConditionals } from './build-conditionals';


export async function generateEsmCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTarget, entryModules: d.EntryModule[], appRegistry: d.AppRegistry) {
  if (outputTarget.type !== 'dist') {
    return;
  }

  // mega-minify the core w/ property renaming, but not the user's globals
  // hardcode which features should and should not go in the core builds
  // process the transpiled code by removing unused code and minify when configured to do so
  let jsContent = await config.sys.getClientCoreFile({ staticName: 'core.esm.js' });

  // browser esm core build
  const globalJsContentsEsm = await generateAppGlobalScript(config, compilerCtx, buildCtx, appRegistry);

  const hasAppGlobalImport = !!(globalJsContentsEsm && globalJsContentsEsm.length);

  if (hasAppGlobalImport) {
    jsContent = `import appGlobal from './${getGlobalEsmFileName(config)}';\n${jsContent}`;
  } else {
    jsContent = `var appGlobal = function(){};\n${jsContent}`;
  }

  // figure out which sections should be included in the core build
  const buildConditionals = await setBuildConditionals(config, compilerCtx, 'esm.es5', buildCtx, entryModules);

  await generateEsmCoreEs5(config, compilerCtx, buildCtx, outputTarget, buildConditionals, jsContent);
}


async function generateEsmCoreEs5(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTarget, buildConditionals: d.BuildConditionals, jsContent: string) {
  buildConditionals.es5 = true;
  jsContent = await buildCoreContent(config, compilerCtx, buildCtx, buildConditionals, jsContent);

  const coreEsm = getCoreEsmBuildPath(config, outputTarget, 'es5');

  // fighting with typescript/webpack/es5 builds too much
  // #dealwithit
  jsContent = jsContent.replace('export function applyPolyfills', 'function applyPolyfills');

  jsContent = jsContent.replace('__APP__NAMESPACE__PLACEHOLDER__', config.namespace);

  jsContent = jsContent.replace('__APP__HYDRATED__CSS__PLACEHOLDER__', config.hydratedCssClass);

  jsContent = generatePreamble(config, { prefix: `${config.namespace}: Core, ES5` }) + '\n' + jsContent;

  await compilerCtx.fs.writeFile(coreEsm, jsContent);
}
