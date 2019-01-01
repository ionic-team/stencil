import * as d from '../../declarations';
import { bundleAppCore } from './bundle-app-core';
import { generateLazyLoadedAppCore } from './generate-lazy-core';
import { generateNativeAppCore } from './generate-native-core';
import { optimizeAppCoreBundle } from './optimize-app-core';
import { pathJoin } from '../util';


export async function generateAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const files = new Map<string, string>();
  const coreImportPath = pathJoin(config, config.sys.compiler.distDir, 'runtime', 'index.js');

  let bundleInput: string;

  if (build.lazyLoad) {
    bundleInput = generateLazyLoadedAppCore(coreImportPath, build);

  } else {
    bundleInput = await generateNativeAppCore(config, compilerCtx, buildCtx, coreImportPath, build, files);
  }

  // bundle up the input into a nice pretty file
  const bundleOutput = await bundleAppCore(config, compilerCtx, buildCtx, coreImportPath, files, bundleInput);
  if (buildCtx.hasError) {
    return null;
  }

  const results = await optimizeAppCoreBundle(config, compilerCtx, build, bundleOutput);
  buildCtx.diagnostics.push(...results.diagnostics);

  return results.output;
}
