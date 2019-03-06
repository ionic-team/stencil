import * as d from '@declarations';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { writeLazyAppCore } from '../component-lazy/write-lazy-app-core';
import { bundleApp, generateRollupBuild } from '../app-core/bundle-app-core';
import { OutputOptions } from 'rollup';
import { sys } from '@sys';


export async function generateLazyLoadedApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistLazy[], cmps: d.ComponentCompilerMeta[]) {
  const timespan = buildCtx.createTimeSpan(`generate lazy components started`, true);

  const build = getBuildConditionals(config, cmps);
  const rollupBuild = await bundleLazyApp(config, compilerCtx, buildCtx, build);

  // const esmEs5Outputs = outputTargets.map(o => o.esmEs5Dir).filter(o => !!o);
  const esmOutputs = outputTargets.map(o => o.esmDir).filter(o => !!o);
  // const cjsOutputs = outputTargets.map(o => o.cjsDir).filter(o => !!o);
  const systemOutputs = outputTargets.map(o => o.systemDir).filter(o => !!o);

  await buildCtx.stylesPromise;

  if (esmOutputs.length > 0) {
    const esmOpts: OutputOptions = {
      format: 'esm',
      entryFileNames: '[name].mjs.js',
      chunkFileNames: build.isDev ? '[name]-[hash].js' : '[hash].js'
    };
    const results = await generateRollupBuild(rollupBuild, esmOpts, config, buildCtx.entryModules);
    const bundleModules = await generateLazyModules(config, compilerCtx, buildCtx, esmOutputs, results, '');
    await writeLazyAppCore(config, compilerCtx, buildCtx, esmOutputs, build, results, bundleModules);
  }

  if (systemOutputs.length > 0) {
    const esmOpts: OutputOptions = {
      format: 'system',
      entryFileNames: '[name].system.js',
      chunkFileNames: build.isDev ? '[name]-[hash].js' : '[hash].js'
    };
    const results = await generateRollupBuild(rollupBuild, esmOpts, config, buildCtx.entryModules);
    const bundleModules = await generateLazyModules(config, compilerCtx, buildCtx, systemOutputs, results, '.system');
    await writeLazyAppCore(config, compilerCtx, buildCtx, systemOutputs, build, results, bundleModules);
    const loader = await getSystemLoader(`${config.fsNamespace}.system.js`);
    await Promise.all(
      systemOutputs.map(dst => compilerCtx.fs.writeFile(sys.path.join(dst, `${config.fsNamespace}.js`), loader))
    );
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

function bundleLazyApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
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
  };

  buildCtx.entryModules.forEach(entryModule => {
    bundleCoreOptions.entryInputs[entryModule.entryKey] = entryModule.entryKey;
  });

  return bundleApp(config, compilerCtx, buildCtx, build, bundleCoreOptions);
}

async function getSystemLoader(coreFilename: string) {
  const staticName = sys.path.join('polyfills', 'esm', 'system.js');
  const systemLoader = await sys.getClientCoreFile({ staticName: staticName });
  return `
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
System.import(new URL('./${coreFilename}', resourcesUrl).pathname).then(m => console.log(m));
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
