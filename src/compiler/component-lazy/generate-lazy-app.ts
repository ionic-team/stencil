import * as d from '@declarations';
import { generateLazyAppCore } from '../component-lazy/generate-lazy-core';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { writeLazyAppCore } from '../component-lazy/write-lazy-app-core';


export async function generateLazyLoadedApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], cmps: d.ComponentCompilerMeta[]) {
  const timespan = buildCtx.createTimeSpan(`generate lazy components started`, true);

  const build = getBuildFeatures(cmps) as d.Build;

  const rollupResults = await generateLazyLoadedCore(config, compilerCtx, buildCtx, build);

  if (Array.isArray(rollupResults) && !buildCtx.shouldAbort) {
    await buildCtx.stylesPromise;

    const bundleModules = await generateLazyModules(config, compilerCtx, buildCtx, outputTargets, rollupResults);

    await writeLazyAppCore(config, compilerCtx, buildCtx, outputTargets, build, rollupResults, bundleModules);
  }

  timespan.finish(`generate lazy components finished`);
}


function generateLazyLoadedCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  build.lazyLoad = true;
  build.es5 = false;
  build.polyfills = false;
  build.hydrateClientSide = false;
  build.hydrateServerSide = false;

  updateBuildConditionals(config, build);

  return generateLazyAppCore(config, compilerCtx, buildCtx, build);
}
