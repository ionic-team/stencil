import * as d from '../../declarations';
import { generateRollupOutput } from '../app-core/bundle-app-core';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { getAppBrowserCorePolyfills } from '../app-core/app-polyfills';
import { OutputOptions, RollupBuild } from 'rollup';
import { relativeImport } from '@utils';

export async function generateSystem(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, rollupBuild: RollupBuild, outputTargets: d.OutputTargetDistLazy[]) {
  if (!config.buildEs5) {
    return;
  }
  const systemOutputs = outputTargets.filter(o => !!o.systemDir);

  if (systemOutputs.length > 0) {
    const esmOpts: OutputOptions = {
      format: 'system',
      entryFileNames: build.isDev ? '[name].system.js' : 'p-[hash].system.js',
      chunkFileNames: build.isDev ? '[name]-[hash].system.js' : 'p-[hash].system.js',
      preferConst: true
    };
    const results = await generateRollupOutput(rollupBuild, esmOpts, config, buildCtx.entryModules);
    if (results != null) {
      const destinations = systemOutputs.map(o => o.esmDir);
      await generateLazyModules(config, compilerCtx, buildCtx, destinations, results, 'es5', true, '.system');
      await generateSystemLoaders(config, compilerCtx, results, systemOutputs);
    }
  }
}

function generateSystemLoaders(config: d.Config, compilerCtx: d.CompilerCtx, rollupResult: d.RollupResult[], systemOutputs: d.OutputTargetDistLazy[]) {
  const loaderFilename = rollupResult.find(r => r.isBrowserLoader).fileName;

  return Promise.all(
    systemOutputs.map((o) => writeSystemLoader(config, compilerCtx, loaderFilename, o))
  );
}

async function writeSystemLoader(config: d.Config, compilerCtx: d.CompilerCtx, loaderFilename: string, outputTarget: d.OutputTargetDistLazy) {
  if (outputTarget.systemLoaderFile) {
    const entryPointPath = config.sys.path.join(outputTarget.systemDir, loaderFilename);
    const relativePath = relativeImport(config, outputTarget.systemLoaderFile, entryPointPath);
    const loaderContent = await getSystemLoader(config, relativePath, outputTarget.polyfills);
    await compilerCtx.fs.writeFile(outputTarget.systemLoaderFile, loaderContent);
  }
}

async function getSystemLoader(config: d.Config, corePath: string, includePolyfills: boolean) {
  const polyfills = includePolyfills ? await getAppBrowserCorePolyfills(config) : '';
  return `
${polyfills}

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
var start = function() {
  var url = new URL('${corePath}', resourcesUrl);
  System.import(url.href);
};

if (win.__stencil_cssshim) {
  win.__stencil_cssshim.initShim().then(start);
} else {
  start();
}
`;
}
