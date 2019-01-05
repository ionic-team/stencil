import * as d from '../../declarations';
import { bundleAppCore } from '../bundle/bundle-app-core';
import { generateLazyLoadedAppCore } from './generate-lazy-core';
import { generateNativeAppCore } from './generate-native-core';
import { optimizeAppCoreBundle } from './optimize-app-core';
import { pathJoin } from '../util';


export async function generateAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const files = new Map<string, string>();
  const coreImportPath = pathJoin(config, config.sys.compiler.distDir, 'client', 'index.js');

  let appCoreBundleInput: string;

  if (build.lazyLoad) {
    appCoreBundleInput = await generateLazyLoadedAppCore(config, compilerCtx, build, coreImportPath);

  } else {
    appCoreBundleInput = await generateNativeAppCore(config, compilerCtx, buildCtx, build, coreImportPath, files);
  }

  // bundle up the input into a nice pretty file
  const appCoreBundleOutput = await bundleAppCore(config, compilerCtx, buildCtx, coreImportPath, files, appCoreBundleInput);
  if (buildCtx.hasError) {
    return null;
  }

  const results = await optimizeAppCoreBundle(config, compilerCtx, build, appCoreBundleOutput);
  buildCtx.diagnostics.push(...results.diagnostics);

  return results.output;
}
