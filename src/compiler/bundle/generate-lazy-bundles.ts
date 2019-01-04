import * as d from '../../declarations';
import { catchError } from '../util';
import { deriveLazyModules } from './derive-lazy-modules';
import { generateLazyChunks } from './generate-lazy-chunks';
import { generateLazyEntries } from './generate-lazy-entries';
import { generateLazyModuleFormats } from './generate-lazy-module-formats';
import { PLUGIN_HELPERS } from '../style/component-styles';


export async function generateLazyBundles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], build: d.Build) {
  if (canSkipGenerateBundles(buildCtx)) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`generate lazy bundles started`);

  // generate the bundled modules, but without the styles added
  const derivedModules = await generateDerivedModules(config, compilerCtx, buildCtx);

  if (derivedModules != null) {
    // Generate chunk files, ie, not entry points for components: chunk-[hash].js
    const chunkPromises = generateLazyChunks(config, compilerCtx, buildCtx, outputTargets, derivedModules);

    // ensure all the styles are done compiling
    await buildCtx.stylesPromise;

    // Generate entry points for components. Each entry-point might emit several files
    // All different modes + scoped
    const entryPromises = generateLazyEntries(config, compilerCtx, buildCtx, outputTargets, build, derivedModules);

    // ensure all entries and chunks are finished
    await Promise.all([
      chunkPromises,
      entryPromises
    ]);
  }

  timeSpan.finish(`generate lazy bundles finished`);
}


async function generateDerivedModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort) {
    return null;
  }

  if (buildCtx.entryModules == null || buildCtx.entryModules.length === 0) {
    // no entry modules, so don't bother
    return null;
  }

  if (buildCtx.isRebuild && !buildCtx.requiresFullBuild && !buildCtx.hasScriptChanges && compilerCtx.lastDerivedModules != null) {
    // this is a rebuild, it doesn't require a full build
    // there were no script changes, and we've got a good cache of the last js modules
    // let's skip this
    buildCtx.debug(`generateLazyModuleMap, using lastDerivedModules cache`);
    return compilerCtx.lastDerivedModules;
  }

  const timespan = buildCtx.createTimeSpan(`module formats started`);

  let derivedModules: d.DerivedModule[] = null;

  try {
    // generate the bundled modules, but without the styles added
    const lazyModuleFormats = await generateLazyModuleFormats(config, compilerCtx, buildCtx);

    if (lazyModuleFormats != null) {
      derivedModules = await deriveLazyModules(config, compilerCtx, buildCtx, lazyModuleFormats);

      // remember for next time incase we change just a css file or something
      compilerCtx.lastDerivedModules = derivedModules;
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
    compilerCtx.lastDerivedModules = null;
  }

  timespan.finish(`module formats finished`);

  return derivedModules;
}


function canSkipGenerateBundles(buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort) {
    return true;
  }

  if (buildCtx.requiresFullBuild) {
    return false;
  }

  if (buildCtx.isRebuild) {
    if (buildCtx.hasScriptChanges || buildCtx.hasStyleChanges) {
      return false;
    }

    return true;
  }

  return false;
}

const EXTS = ['tsx', 'ts', 'js', 'mjs', 'css'];
PLUGIN_HELPERS.forEach(p => p.pluginExts.forEach(pe => EXTS.push(pe)));
