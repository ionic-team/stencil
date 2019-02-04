import * as d from '@declarations';
import { formatComponentRuntimeMeta, stringifyRuntimeData } from '../app-core/format-component-runtime-meta';
import { optimizeAppCoreBundle } from '../app-core/optimize-app-core';
import { sys } from '@sys';


export function writeLazyAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], build: d.Build, rollupResults: d.RollupResult[], bundleModules: d.BundleModule[]) {
  const appCoreRollupResults = rollupResults.filter(r => r.isAppCore);

  const lazyRuntimeData = formatLazyBundlesRuntimeMeta(bundleModules);

  return Promise.all(appCoreRollupResults.map(rollupResult => {
    return writeLazyAppCoreResults(config, compilerCtx, buildCtx, outputTargets, build, lazyRuntimeData, rollupResult);
  }));
}


async function writeLazyAppCoreResults(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], build: d.Build, lazyRuntimeData: string, rollupResult: d.RollupResult) {
  const results = await optimizeAppCoreBundle(config, compilerCtx, build, rollupResult.code);

  buildCtx.diagnostics.push(...results.diagnostics);

  if (buildCtx.shouldAbort) {
    return;
  }

  // inject the component metadata
  const code = results.output.replace(
                 `[].forEach(lazyBundle`,
                 `${lazyRuntimeData}.forEach(lazyBundle`
               );

  await Promise.all(outputTargets.map(outputTarget => {
    const filePath = sys.path.join(outputTarget.buildDir, rollupResult.fileName);
    return compilerCtx.fs.writeFile(filePath, code);
  }));
}


function formatLazyBundlesRuntimeMeta(bundleModules: d.BundleModule[]) {
  // [[{ios: 'abc12345', md: 'dec65432'}, {cmpTag: 'ion-icon', cmpMembers: []}]]

  const lazyBundles = bundleModules.map(bundleModule => {
    return formatLazyRuntimeBundle(bundleModule);
  });

  return stringifyRuntimeData(lazyBundles);
}


function formatLazyRuntimeBundle(bundleModule: d.BundleModule) {
  let bundleId: any;

  if (bundleModule.modeNames.length > 1) {
    // more than one mode, object of bundleIds with the mode as a key
    bundleId = {};
    bundleModule.outputs.forEach(output => {
      bundleId[output.modeName] = output.bundleId;
    });

  } else {
    // only one default mode, bundleId is a string
    bundleId = bundleModule.entryKey;
  }

  const lazyBundle: d.LazyBundleRuntimeData = [
    bundleId,
    bundleModule.cmps.map(cmp => formatComponentRuntimeMeta(cmp, true))
  ];
  return lazyBundle;
}
