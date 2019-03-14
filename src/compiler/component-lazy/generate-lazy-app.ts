import * as d from '../../declarations';
import { bundleApp, generateRollupBuild } from '../app-core/bundle-app-core';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { getAppBrowserCorePolyfills } from '../app-core/app-polyfills';
import { isOutputTargetHydrate } from '../output-targets/output-utils';
import { OutputOptions } from 'rollup';


export async function generateLazyLoadedApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistLazy[], cmps: d.ComponentCompilerMeta[]) {
  const timespan = buildCtx.createTimeSpan(`generate lazy components started`);

  const build = getBuildConditionals(config, cmps);
  const rollupBuild = await bundleLazyApp(config, compilerCtx, buildCtx, build);

  // const esmEs5Outputs = outputTargets.map(o => o.esmEs5Dir).filter(o => !!o);
  const esmOutputs = outputTargets.filter(o => !!o.esmDir);
  // const cjsOutputs = outputTargets.map(o => o.cjsDir).filter(o => !!o);
  const systemOutputs = outputTargets.filter(o => !!o.systemDir);

  await buildCtx.stylesPromise;

  if (esmOutputs.length > 0) {
    const esmOpts: OutputOptions = {
      format: 'esm',
      entryFileNames: '[name].mjs.js',
      chunkFileNames: build.isDev ? '[name]-[hash].js' : '[hash].js'
    };
    const destinations = esmOutputs.map(o => o.esmDir);
    const results = await generateRollupBuild(rollupBuild, esmOpts, config, buildCtx.entryModules);
    if (results != null) {
      await generateLazyModules(config, compilerCtx, buildCtx, destinations, results, 'es2017', '');
    }
  }

  if (systemOutputs.length > 0) {
    const esmOpts: OutputOptions = {
      format: 'system',
      entryFileNames: '[name].system.js',
      chunkFileNames: build.isDev ? '[name]-[hash].js' : '[hash].js'
    };
    const destinations = esmOutputs.map(o => o.esmDir);
    const results = await generateRollupBuild(rollupBuild, esmOpts, config, buildCtx.entryModules);
    if (results != null) {
      await generateLazyModules(config, compilerCtx, buildCtx, destinations, results, 'es5', '.system');
      await Promise.all(
        systemOutputs.map(async o => {
          const loader = await getSystemLoader(config, `${config.fsNamespace}.system.js`, o.polyfills);
          await compilerCtx.fs.writeFile(config.sys.path.join(o.systemDir, `${config.fsNamespace}.js`), loader);
        })
      );
    }
  }

  timespan.finish(`generate lazy components finished`);
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
  const bundleCoreOptions: d.BundleCoreOptions = {
    loader: {
      '@stencil/core/app': CORE,
      '@core-entrypoint': BROWSER_ENTRY,
      '@external-entrypoint': EXTERNAL_ENTRY,
    },
    entryInputs: {
      [config.fsNamespace]: '@core-entrypoint',
      'loader': '@external-entrypoint',
    },
    coreChunk: true,
    cache: compilerCtx.lazyModuleRollupCache
  };

  buildCtx.entryModules.forEach(entryModule => {
    bundleCoreOptions.entryInputs[entryModule.entryKey] = entryModule.entryKey;
  });
  const rollupBuild = await bundleApp(config, compilerCtx, buildCtx, build, bundleCoreOptions);
  compilerCtx.lazyModuleRollupCache = rollupBuild.cache;
  return rollupBuild;
}

async function getSystemLoader(config: d.Config, coreFilename: string, includePolyfills: boolean) {
  const staticName = config.sys.path.join('polyfills', 'esm', 'system.js');
  const polyfills = includePolyfills ? await getAppBrowserCorePolyfills(config) : '';
  const systemLoader = await config.sys.getClientCoreFile({ staticName: staticName });
  return `
${polyfills}
${systemLoader}
// Find resourceUrl
var doc = document;
var allScripts = doc.querySelectorAll('script');
var scriptElm;
for (var x = allScripts.length - 1; x >= 0; x--) {
  scriptElm = allScripts[x];
  if (scriptElm.src || scriptElm.hasAttribute('data-resources-url')) {
    break;
  }
}
var resourcesUrl = scriptElm ? scriptElm.getAttribute('data-resources-url') || scriptElm.src : '';

// Load resource
System.import(new URL('./${coreFilename}', resourcesUrl).pathname);
`;
}

const CORE = `
import { bootstrapLazy } from '@stencil/core/platform';
import globalScripts from '@stencil/core/global-scripts';
export * from '@stencil/core/platform';
export const defineCustomElements = win => {
  globalScripts(win);
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
