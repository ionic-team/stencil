import * as d from '@declarations';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { writeLazyAppCore } from '../component-lazy/write-lazy-app-core';
import { bundleApp, generateRollupBuild } from '../app-core/bundle-app-core';
import { OutputOptions } from 'rollup';


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
    loader: {
      '@stencil/core/app': CORE,
      '@core-entrypoint': BROWSER_ENTRY,
      '@external-entrypoint': EXTERNAL_ENTRY,
    },
    entryInputs: {
      'loader': '@external-entrypoint',
    },
    coreChunk: true,
  };

  buildCtx.entryModules.forEach(entryModule => {
    bundleCoreOptions.entryInputs[entryModule.entryKey] = entryModule.entryKey;
  });

  const rollupBuild = await bundleApp(config, compilerCtx, buildCtx, build, bundleCoreOptions);
  const outputOpts: OutputOptions = {
    format: 'esm',
    chunkFileNames: build.isDev ? '[name]-[hash].js' : '[hash].js'
  };
  return generateRollupBuild(rollupBuild, outputOpts, config, buildCtx.entryModules);
}

const CORE = `
import { bootstrapLazy } from '@stencil/core/platform';
export * from '@stencil/core/platform';
import '@global-scripts';
export const defineCustomElements = (win) => {
  bootstrapLazy([/*!__STENCIL_LAZY_DATA__*/]);
};
`;

const BROWSER_ENTRY = `
import { defineCustomElements } from '@stencil/core/app';
defineCustomElements(window);
`;

// This is for webpack
const EXTERNAL_ENTRY = `
export { defineCustomElements } from '@stencil/core/app';
`;
