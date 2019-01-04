import * as d from '../../declarations';
import { generateAppCore } from '../app-core/generate-app-core';
import { generateLazyBundles } from '../bundle/generate-lazy-bundles';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';


export async function generateLazyLoads(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetBuild[]).filter(o => {
    return ((o.type === 'www' || o.type === 'dist') && buildCtx.moduleFiles.length >= MIN_FOR_LAZY_LOAD);
  });

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate app lazy components started`, true);

  const appModuleFiles = buildCtx.moduleFiles.filter(m => m.cmpCompilerMeta);

  const build = getBuildFeatures(buildCtx.moduleFiles, appModuleFiles) as d.Build;

  build.lazyLoad = true;
  build.es5 = false;
  build.slotPolyfill = false;
  build.polyfills = false;
  build.prerenderClientSide = false;
  build.prerenderServerSide = false;

  updateBuildConditionals(config, build);

  const appCorePromise = generateAppCore(config, compilerCtx, buildCtx, build);

  const lazyBundlesPromise = generateLazyBundles(config, compilerCtx, buildCtx, outputTargets, build);

  await Promise.all([
    appCorePromise,
    lazyBundlesPromise
  ]);

  timespan.finish(`generate app lazy components finished`);
}


export const MIN_FOR_LAZY_LOAD = 6;
