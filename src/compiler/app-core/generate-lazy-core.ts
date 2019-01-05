import * as d from '../../declarations';
import { bundleAppCore } from '../bundle/bundle-app-core';
import { formatBrowserLoaderComponent } from '../../util/data-serialize';
import { optimizeAppCoreBundle } from './optimize-app-core';


export async function generateLazyLoadedAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, coreImportPath: string) {
  const c: string[] = [];

  const cmpHostData = build.appModuleFiles.map(m => formatBrowserLoaderComponent(m.cmpCompilerMeta));

  c.push(`import { bootstrapLazy } from '${coreImportPath}';`);

  c.push(`bootstrapLazy(${JSON.stringify(cmpHostData)});`);

  if (build.vdomRender) {
    c.push(`export { h } from '${coreImportPath}';`);
  }

  const appCoreBundleInput = c.join('\n');

  // bundle up the input into a nice pretty file
  const files = new Map();
  const appCoreBundleOutput = await bundleAppCore(config, compilerCtx, buildCtx, coreImportPath, files, appCoreBundleInput);
  if (buildCtx.hasError) {
    return null;
  }

  const results = await optimizeAppCoreBundle(config, compilerCtx, build, appCoreBundleOutput);
  buildCtx.diagnostics.push(...results.diagnostics);

  return results.output;
}
