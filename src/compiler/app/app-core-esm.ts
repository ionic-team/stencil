import * as d from '../../declarations';
import { buildCoreContent } from './build-core-content';
import { generatePreamble } from '../util';
import { getCoreEsmBuildPath, getGlobalEsmFileName } from './app-file-naming';
import { generateEsmAppGlobalScript } from './app-global-scripts';
import { setBuildConditionals } from '../../util/build-conditionals';


export async function generateEsmCores(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetBuild, entryModules: d.EntryModule[]) {
  if (outputTarget.type === 'dist' && config.buildEsm) {
    // mega-minify the core w/ property renaming, but not the user's globals
    // hardcode which features should and should not go in the core builds
    // process the transpiled code by removing unused code and minify when configured to do so
    const cores = [
      generateEsmCore(config, compilerCtx, buildCtx, outputTarget, entryModules, 'es2017', 'esm.es2017')
    ];
    if (config.buildEs5) {
      cores.push(
        generateEsmCore(config, compilerCtx, buildCtx, outputTarget, entryModules, 'es5', 'esm.es5'),
      );
    }
    await Promise.all(cores);
  }
}

export async function generateEsmCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDist, entryModules: d.EntryModule[], sourceTarget: d.SourceTarget, coreId: d.BuildCoreIds) {
  let jsContent = await config.sys.getClientCoreFile({ staticName: 'core.esm.js' });

  // browser esm core build
  const globalJsContentsEsm = await generateEsmAppGlobalScript(config, compilerCtx, buildCtx, sourceTarget);
  const hasAppGlobalImport = !!(globalJsContentsEsm && globalJsContentsEsm.length);

  if (hasAppGlobalImport) {
    jsContent = `import appGlobal from './${getGlobalEsmFileName(config)}';\n${jsContent}`;
  } else {
    jsContent = `var appGlobal = function(){};\n${jsContent}`;
  }

  // figure out which sections should be included in the core build
  const buildConditionals = await setBuildConditionals(config, compilerCtx, coreId, buildCtx, entryModules);
  await writeEsmCore(config, compilerCtx, buildCtx, outputTarget, buildConditionals, jsContent, sourceTarget);
}


async function writeEsmCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDist, buildConditionals: d.BuildConditionals, jsContent: string, sourceTarget: d.SourceTarget) {
  const coreEsm = getCoreEsmBuildPath(config, outputTarget, sourceTarget);
  const relPath = config.sys.path.relative(config.rootDir, coreEsm);

  const timespan = buildCtx.createTimeSpan(`generateEsmCoreEs5 started, ${relPath}`, true);

  buildConditionals.es5 = true;
  jsContent = await buildCoreContent(config, compilerCtx, buildCtx, buildConditionals, jsContent);

  // fighting with typescript/webpack/es5 builds too much
  // #dealwithit
  jsContent = jsContent.replace('export function applyPolyfills', 'function applyPolyfills');

  jsContent = jsContent.replace('__APP__NAMESPACE__PLACEHOLDER__', config.namespace);

  jsContent = jsContent.replace('__APP__HYDRATED__CSS__PLACEHOLDER__', config.hydratedCssClass);

  jsContent = generatePreamble(config, { prefix: `${config.namespace}: Core, ${sourceTarget}`, defaultBanner: true }) + '\n' + jsContent;

  await compilerCtx.fs.writeFile(coreEsm, jsContent);

  timespan.finish(`writeEsmCore ${sourceTarget} finished, ${relPath}`);
}
