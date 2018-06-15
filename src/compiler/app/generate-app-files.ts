import * as d from '../../declarations';
import { catchError } from '../util';
import { createAppRegistry, writeAppRegistry } from './app-registry';
import { generateAppGlobalScript } from './app-global-scripts';
import { generateCoreBrowser } from './app-core-browser';
import { generateEsmCore } from './app-core-esm';
import { generateEsmHosts } from '../distribution/dist-esm';
import { generateEs5DisabledMessage } from './app-es5-disabled';
import { generateLoader } from './app-loader';
import { setBuildConditionals } from './build-conditionals';


export async function generateAppFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[], cmpRegistry: d.ComponentRegistry) {
  if (canSkipBuild(compilerCtx, buildCtx)) {
    return;
  }

  const outputTargets = config.outputTargets.filter(outputTarget => {
    return outputTarget.appBuild;
  });

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate app files started`);

  await Promise.all(outputTargets.map(async outputTarget => {
    await generateAppFilesOutputTarget(config, compilerCtx, buildCtx, outputTarget, entryModules, cmpRegistry);
  }));

  timespan.finish(`generate app files finished`);
}


export async function generateAppFilesOutputTarget(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTarget, entryModules: d.EntryModule[], cmpRegistry: d.ComponentRegistry) {
  if (!config.buildAppCore) {
    return;
  }

  try {
    // generate the shared app registry object
    const appRegistry = createAppRegistry(config);

    await Promise.all([
      // browser core esm build
      generateBrowserCoreEsm(config, compilerCtx, buildCtx, outputTarget, entryModules, appRegistry),

      // browser core es5 build
      generateBrowserCoreEs5(config, compilerCtx, buildCtx, outputTarget, entryModules, appRegistry),

      // core esm
      generateEsmCore(config, compilerCtx, buildCtx, outputTarget, entryModules, appRegistry)
    ]);

    await Promise.all([
      // create a json file for the app registry
      writeAppRegistry(config, compilerCtx, buildCtx, outputTarget, appRegistry, cmpRegistry),

      // create the loader(s) after creating the loader file name
      generateLoader(config, compilerCtx, buildCtx, outputTarget, appRegistry, cmpRegistry),

      // create the custom elements file
      generateEsmHosts(config, compilerCtx, cmpRegistry, outputTarget)
    ]);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}


async function generateBrowserCoreEsm(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTarget, entryModules: d.EntryModule[], appRegistry: d.AppRegistry) {
  // browser esm core build
  const globalJsContentsEsm = await generateAppGlobalScript(config, compilerCtx, buildCtx, appRegistry);

  // figure out which sections should be included in the core build
  const buildConditionals = await setBuildConditionals(config, compilerCtx, 'core', buildCtx, entryModules);

  const coreFilename = await generateCoreBrowser(config, compilerCtx, buildCtx, outputTarget, globalJsContentsEsm, buildConditionals);
  appRegistry.core = coreFilename;
}


async function generateBrowserCoreEs5(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTarget, entryModules: d.EntryModule[], appRegistry: d.AppRegistry) {
  if (config.buildEs5) {
    // browser core es5 build
    const globalJsContentsEs5 = await generateAppGlobalScript(config, compilerCtx, buildCtx, appRegistry, 'es5');

    const buildConditionalsEs5 = await setBuildConditionals(config, compilerCtx, 'core.pf', buildCtx, entryModules);

    const coreFilenameEs5 = await generateCoreBrowser(config, compilerCtx, buildCtx, outputTarget, globalJsContentsEs5, buildConditionalsEs5);
    appRegistry.corePolyfilled = coreFilenameEs5;

  } else {
    // not doing an es5, probably in dev mode
    appRegistry.corePolyfilled = await generateEs5DisabledMessage(config, compilerCtx, outputTarget);
  }
}


function canSkipBuild(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort()) {
    return true;
  }

  if (compilerCtx.isRebuild) {
    if (buildCtx.filesChanged.some(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js'))) {
      return false;
    }

    return true;
  }

  return false;
}
