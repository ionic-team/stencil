import * as d from '@declarations';
import { bundleAppCore } from '../app-core/bundle-app-core';
import { formatComponentRuntimeMeta } from '../app-core/format-component-runtime-meta';
import { optimizeAppCoreBundle } from '../app-core/optimize-app-core';
import { sys } from '@sys';


export async function generateLazyAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const appCoreEntryFilePath = await generateLazyAppCoreEntry(config, compilerCtx, build);

  const bundleEntryInputs: d.BundleEntryInputs = {};

  bundleEntryInputs[config.fsNamespace] = appCoreEntryFilePath;

  buildCtx.entryModules.forEach(entryModule => {
    bundleEntryInputs[entryModule.entryKey] = entryModule.entryKey;
  });

  return await bundleAppCore(config, compilerCtx, buildCtx, build, buildCtx.entryModules, appCoreEntryFilePath, bundleEntryInputs);
}


async function generateLazyAppCoreEntry(config: d.Config, compilerCtx: d.CompilerCtx, _build: d.Build) {
  const appCoreEntryFileName = `${config.fsNamespace}-lazy.mjs`;
  const appCoreEntryFilePath = sys.path.join(config.srcDir, appCoreEntryFileName);

  const coreText: string[] = [];

  coreText.push(`import { bootstrapLazy } from '@stencil/core/runtime';`);

  coreText.push(`bootstrapLazy([]);`);

  coreText.push(`export { registerLazyInstance } from '@stencil/core/platform';`);
  coreText.push(`export { h, getElement, createEvent } from '@stencil/core/runtime';`);

  await compilerCtx.fs.writeFile(appCoreEntryFilePath, coreText.join('\n'), { inMemoryOnly: true });

  return appCoreEntryFilePath;
}


export async function writeLazyAppCoreOutput(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], build: d.Build, rollupResults: d.RollupResult[], bundleModules: d.BundleModule[]) {
  const appCoreRollupResults = rollupResults.filter(r => r.isAppCore);

  const lazyRuntimeData = formatLazyBundlesRuntimeMeta(bundleModules);

  await Promise.all(appCoreRollupResults.map(async rollupResult => {
    const results = await optimizeAppCoreBundle(config, compilerCtx, build, rollupResult.code);

    buildCtx.diagnostics.push(...results.diagnostics);

    if (buildCtx.shouldAbort) {
      return;
    }

    const code = results.output
                        .replace(`[].forEach(lazyBundle`, `${lazyRuntimeData}.forEach(lazyBundle`);

    await Promise.all(outputTargets.map(async outputTarget => {
      const filePath = sys.path.join(outputTarget.buildDir, rollupResult.fileName);
      await compilerCtx.fs.writeFile(filePath, code);
    }));
  }));
}


function formatLazyBundlesRuntimeMeta(bundleModules: d.BundleModule[]) {
  // [[{ios: 'abc12345', md: 'dec65432'}, {cmpTag: 'ion-icon', cmpMembers: []}]]

  const lazyBundles = bundleModules.map(bundleModule => {
    return formatLazyRuntimeBundle(bundleModule);
  });

  // stringify the data, then remove property double-quotes so they can be property renamed
  return JSON.stringify(lazyBundles)
             .replace(/"cmpTag"/g, 'cmpTag')
             .replace(/"cmpMeta"/g, 'cmpMeta')
             .replace(/"cmpHostListeners"/g, 'cmpHostListeners')
             .replace(/"cmpShadowDomEncapsulation"/g, 'cmpShadowDomEncapsulation')
             .replace(/"cmpScopedCssEncapsulation"/g, 'cmpScopedCssEncapsulation')
             .replace(/"cmpMembers"/g, 'cmpMembers');
}


function formatLazyRuntimeBundle(bundleModule: d.BundleModule) {
  const lazyBundle: d.LazyBundleRuntimeData = [
    bundleModule.entryKey,
    bundleModule.cmps.map(cmp => formatComponentRuntimeMeta(cmp, true))
  ];
  return lazyBundle;
}
