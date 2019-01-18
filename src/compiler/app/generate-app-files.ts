import * as d from '@declarations';
import { catchError } from '../util';
import { createAppRegistry, writeAppRegistry } from './app-registry';
import { generateBrowserAppGlobalScript } from './app-global-scripts';
import { generateCoreBrowser } from './app-core-browser';
import { generateEsmCores } from './app-core-esm';
import { generateEsmHosts } from '../distribution/dist-esm';
import { generateEs5DisabledMessage } from './app-es5-disabled';
import { generateLoader } from './app-loader';
import { setBuildConditionals } from '../../util/build-conditionals';


export async function generateAppFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[], cmpRegistry: d.ComponentRegistry) {
  if (canSkipAppFiles(buildCtx, cmpRegistry)) {
    return;
  }

  const outputTargets = config.outputTargets.filter(outputTarget => {
    return outputTarget.appBuild;
  }) as d.OutputTargetBuild[];

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate app files started`);

  await Promise.all(outputTargets.map(async outputTarget => {
    await generateAppFilesOutputTarget(config, compilerCtx, buildCtx, outputTarget, entryModules, cmpRegistry);
  }));

  timespan.finish(`generate app files finished`);
}


export async function generateAppFilesOutputTarget(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetBuild, entryModules: d.EntryModule[], cmpRegistry: d.ComponentRegistry) {
  if (!config.buildAppCore) {
    return;
  }

  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
    return;
  }

  try {
    // generate the shared app registry object
    const appRegistry = createAppRegistry(config);

    await Promise.all([
      // browser core esm build
      generateBrowserCore(config, compilerCtx, buildCtx, outputTarget, entryModules, cmpRegistry, appRegistry),

      // browser core es5 build
      generateBrowserCoreEs5(config, compilerCtx, buildCtx, outputTarget, entryModules, cmpRegistry, appRegistry),

      // core esm
      generateEsmCores(config, compilerCtx, buildCtx, outputTarget, entryModules)
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


async function generateBrowserCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetBuild, entryModules: d.EntryModule[], cmpRegistry: d.ComponentRegistry, appRegistry: d.AppRegistry) {
  // browser esm core build
  const globalJsContentsEsm = await generateBrowserAppGlobalScript(config, compilerCtx, buildCtx, appRegistry, 'es2017');

  // figure out which sections should be included in the core build
  const buildConditionals = await setBuildConditionals(config, compilerCtx, 'core', buildCtx, entryModules);

  const staticName = 'core.browser.js';
  const coreFilename = await generateCoreBrowser(config, compilerCtx, buildCtx, outputTarget, cmpRegistry, staticName, globalJsContentsEsm, buildConditionals);
  appRegistry.core = coreFilename;
}


async function generateBrowserCoreEs5(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetBuild, entryModules: d.EntryModule[], cmpRegistry: d.ComponentRegistry, appRegistry: d.AppRegistry) {
  if (config.buildEs5) {
    // browser core es5 build
    const globalJsContentsEs5 = await generateBrowserAppGlobalScript(config, compilerCtx, buildCtx, appRegistry, 'es5');

    const buildConditionalsEs5 = await setBuildConditionals(config, compilerCtx, 'core.pf', buildCtx, entryModules);

    const staticName = 'core.browser.legacy.js';
    const coreFilenameEs5 = await generateCoreBrowser(config, compilerCtx, buildCtx, outputTarget, cmpRegistry, staticName, globalJsContentsEs5, buildConditionalsEs5);
    appRegistry.corePolyfilled = coreFilenameEs5;

  } else {
    // not doing an es5, probably in dev mode
    appRegistry.corePolyfilled = await generateEs5DisabledMessage(config, compilerCtx, outputTarget);
  }
}


function canSkipAppFiles(buildCtx: d.BuildCtx, cmpRegistry: d.ComponentRegistry) {
  if (buildCtx.hasError || !cmpRegistry) {
    return true;
  }

  if (buildCtx.requiresFullBuild) {
    return false;
  }

  if (buildCtx.isRebuild) {
    if (buildCtx.hasScriptChanges) {
      return false;
    }

    return true;
  }

  return false;
}
