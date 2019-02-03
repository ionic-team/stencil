import * as d from '@declarations';
import { generateLazyAppCore } from '../component-lazy/generate-lazy-core';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { writeLazyAppCore } from '../component-lazy/write-lazy-app-core';


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

  const cmps = buildCtx.moduleFiles.reduce((cmps, m) => {
    cmps.push(...m.cmps);
    return cmps;
  }, [] as d.ComponentCompilerMeta[]);

  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = true;
  build.es5 = false;
  build.slotPolyfill = false;
  build.polyfills = false;
  build.prerenderClientSide = false;
  build.prerenderServerSide = false;

  updateBuildConditionals(config, build);

  const rollupResults = await generateLazyAppCore(config, compilerCtx, buildCtx, build);

  if (Array.isArray(rollupResults) && !buildCtx.shouldAbort) {
    await buildCtx.stylesPromise;

    const bundleModules = await generateLazyModules(config, compilerCtx, buildCtx, outputTargets, rollupResults);

    await writeLazyAppCore(config, compilerCtx, buildCtx, outputTargets, build, rollupResults, bundleModules);
  }

  timespan.finish(`generate app lazy components finished`);
}


export const MIN_FOR_LAZY_LOAD = 6;
