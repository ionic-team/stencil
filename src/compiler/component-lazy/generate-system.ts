import * as d from '../../declarations';
import { generateRollupBuild } from '../app-core/bundle-app-core';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { getAppBrowserCorePolyfills } from '../app-core/app-polyfills';
import { OutputOptions, RollupBuild } from 'rollup';

export async function generateSystem(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, rollupBuild: RollupBuild, outputTargets: d.OutputTargetDistLazy[]) {
  const systemOutputs = config.buildEs5 ? outputTargets.filter(o => !!o.systemDir) : [];

  if (systemOutputs.length > 0) {
    const esmOpts: OutputOptions = {
      format: 'system',
      entryFileNames: '[name].system.js',
      chunkFileNames: build.isDev ? '[name]-[hash].js' : '[hash].js'
    };
    const results = await generateRollupBuild(rollupBuild, esmOpts, config, buildCtx.entryModules);
    if (results != null) {
      const destinations = systemOutputs.map(o => o.esmDir);
      await generateLazyModules(config, compilerCtx, buildCtx, destinations, results, 'es5', '.system');
      await generateSystemLoader(config, compilerCtx, systemOutputs);
    }
  }
}

function generateSystemLoader(config: d.Config, compilerCtx: d.CompilerCtx, systemOutputs: d.OutputTargetDistLazy[]) {
  return Promise.all(
    systemOutputs.map(async o => {
      const loader = await getSystemLoader(config, `${config.fsNamespace}.system.js`, o.polyfills);
      await compilerCtx.fs.writeFile(config.sys.path.join(o.systemDir, `${config.fsNamespace}.js`), loader);
    })
  );
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
