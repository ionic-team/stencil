import * as d from '@declarations';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { writeLazyAppCore } from '../component-lazy/write-lazy-app-core';
import { bundleApp } from '../app-core/bundle-app-core';


export async function generateLazyLoadedApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistLazy[], cmps: d.ComponentCompilerMeta[]) {
  const timespan = buildCtx.createTimeSpan(`generate lazy components started`, true);

  const build = getBuildConditionals(config, cmps);
  const rollupResults = await bundleLazyApp(config, compilerCtx, buildCtx, build);

  if (Array.isArray(rollupResults) && !buildCtx.shouldAbort) {
    await buildCtx.stylesPromise;

    const bundleModules = await generateLazyModules(config, compilerCtx, buildCtx, outputTargets, rollupResults);

    await writeLazyAppCore(config, compilerCtx, buildCtx, outputTargets, build, rollupResults, bundleModules);
  }

  timespan.finish(`generate lazy components finished`);
}


function getBuildConditionals(config: d.Config, cmps: d.ComponentCompilerMeta[]) {
  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = true;
  build.es5 = false;
  build.polyfills = false;
  build.hydrateClientSide = false;
  build.hydrateServerSide = false;

  updateBuildConditionals(config, build);

  return build;
}

async function bundleLazyApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const bundleCoreOptions: d.BundleCoreOptions = {
    entryInputs: {},
    moduleFormats: ['esm'],
    core: LAZY_CORE,
    mainEntry: LAZY_ENTRY,
    coreChunk: true,
  };

  buildCtx.entryModules.forEach(entryModule => {
    bundleCoreOptions.entryInputs[entryModule.entryKey] = entryModule.entryKey;
  });

  return bundleApp(config, compilerCtx, buildCtx, build, bundleCoreOptions);
}

const LAZY_CORE = `
import { bootstrapLazy } from '@stencil/core/platform';
import '@global-scripts';

bootstrapLazy([/*!__STENCIL_LAZY_DATA__*/]);

export * from '@stencil/core/platform';
`;

const LAZY_ENTRY = `
import '@stencil/core/app';
`;
