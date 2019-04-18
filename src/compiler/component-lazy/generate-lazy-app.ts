import * as d from '../../declarations';
import { bundleApp } from '../app-core/bundle-app-core';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { isOutputTargetHydrate } from '../output-targets/output-utils';
import { generateEsm } from './generate-esm';
import { generateSystem } from './generate-system';
import { generateCjs } from './generate-cjs';
import { generateLoaders } from './generate-loader';

export async function generateLazyLoadedApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistLazy[]) {
  const timespan = buildCtx.createTimeSpan(`bundling components started`);

  const cmps = buildCtx.components;
  const build = getBuildConditionals(config, cmps);
  const rollupBuild = await bundleLazyApp(config, compilerCtx, buildCtx, build);

  if (buildCtx.shouldAbort) {
    return null;
  }

  await buildCtx.stylesPromise;

  const [bundleModules] = await Promise.all([
    generateEsm(config, compilerCtx, buildCtx, build, rollupBuild, true, outputTargets.filter(o => !!o.isBrowserBuild)),
    generateEsm(config, compilerCtx, buildCtx, build, rollupBuild, false, outputTargets.filter(o => !o.isBrowserBuild)),
    generateSystem(config, compilerCtx, buildCtx, build, rollupBuild, outputTargets),
    generateCjs(config, compilerCtx, buildCtx, build, rollupBuild, outputTargets),

    generateLoaders(config, compilerCtx, outputTargets)
  ]);

  timespan.finish(`bundling components finished`);

  return bundleModules;
}

function getBuildConditionals(config: d.Config, cmps: d.ComponentCompilerMeta[]) {
  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = true;
  build.es5 = false;
  build.polyfills = false;
  build.hydrateServerSide = false;

  const hasHydrateOutputTargets = config.outputTargets.some(isOutputTargetHydrate);
  build.hydrateClientSide = hasHydrateOutputTargets;

  updateBuildConditionals(config, build);

  return build;
}

async function bundleLazyApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const loader: any = {
    '@stencil/core': CORE,
    '@core-entrypoint': BROWSER_ENTRY,
    '@external-entrypoint': EXTERNAL_ENTRY,
  };

  // Provide an empty index.js if the projects does not provide one
  const usersIndexJsPath = config.sys.path.join(config.srcDir, 'index.js');
  const hasUserDefinedIndex = await compilerCtx.fs.access(usersIndexJsPath);
  if (!hasUserDefinedIndex) {
    // We can use the loader rollup plugin to inject content to the "index" chunk
    loader[usersIndexJsPath] = `//! Autogenerated index`;
  }

  const bundleAppOptions: d.BundleAppOptions = {
    loader,
    inputs: {
      [config.fsNamespace]: '@core-entrypoint',
      'loader': '@external-entrypoint',
      'index': usersIndexJsPath
    },
    emitCoreChunk: true,
    cache: compilerCtx.rollupCacheLazy
  };

  buildCtx.entryModules.forEach(entryModule => {
    bundleAppOptions.inputs[entryModule.entryKey] = entryModule.entryKey;
  });

  const rollupBuild = await bundleApp(config, compilerCtx, buildCtx, build, bundleAppOptions);
  if (rollupBuild != null) {
    compilerCtx.rollupCacheLazy = rollupBuild.cache;
  } else {
    compilerCtx.rollupCacheLazy = null;
  }
  return rollupBuild;
}

const CORE = `
import { bootstrapLazy, patchDynamicImport } from '@stencil/core/platform';
import globalScripts from '@stencil/core/global-scripts';
export * from '@stencil/core/platform';
export const defineCustomElements = (win, options) => {
  globalScripts(win);
  patchDynamicImport(win);
  bootstrapLazy([/*!__STENCIL_LAZY_DATA__*/], win, options);
};
`;

const BROWSER_ENTRY = `
import { defineCustomElements } from '@stencil/core';
defineCustomElements(window);
`;

// This is for webpack
const EXTERNAL_ENTRY = `
export { defineCustomElements } from '@stencil/core';
`;
