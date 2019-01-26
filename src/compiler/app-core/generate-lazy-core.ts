import * as d from '@declarations';
import { bundleAppCore } from './bundle-app-core';
import { formatComponentRuntimeMeta } from './format-component-runtime-meta';
import { optimizeAppCoreBundle } from './optimize-app-core';


export async function generateLazyLoadedAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, lazyModules: d.LazyModuleOutput[]) {
  const cmpRuntimeData = formatLazyComponentRuntimeEntryModule(buildCtx.entryModules, lazyModules);
  cmpRuntimeData;

  const appCoreInputFiles = new Map();

  const appCoreInputEntryFile = '';

  appCoreInputFiles.set(appCoreInputEntryFile, '');

  const appCoreBundleOutput = await bundleAppCore(config, compilerCtx, buildCtx, build, appCoreInputEntryFile, appCoreInputFiles);
  if (buildCtx.hasError) {
    return null;
  }

  const results = await optimizeAppCoreBundle(config, compilerCtx, build, appCoreBundleOutput);
  buildCtx.diagnostics.push(...results.diagnostics);

  return results.output;
}


function formatLazyComponentRuntimeEntryModule(entryModules: d.EntryModule[], lazyModules: d.LazyModuleOutput[]) {
  // [[{ios: 'abc12345', md: 'dec65432'}, {tagName: 'ion-icon', members: []}]]

  const lazyBundles: d.LazyBundlesRuntimeMeta = entryModules.map(entryModule => {
    const bundleId = getBundleId(entryModule, lazyModules);
    return formatLazyCompnonentRuntimeBundle(bundleId, entryModule.cmps);
  });

  return lazyBundles;
}


function formatLazyCompnonentRuntimeBundle(bundleId: d.ModeBundleId, cmps: d.ComponentCompilerMeta[]) {
  const lazyBundle: d.LazyBundleRuntimeMeta = [
    bundleId,
    cmps.map(cmp => formatComponentRuntimeMeta(cmp, true))
  ];
  return lazyBundle;
}


function getBundleId(entryModule: d.EntryModule, lazyModules: d.LazyModuleOutput[]): d.ModeBundleId {
  if (entryModule.modeNames.length === 0) {
    throw new Error(`entry module does not have any modes`);
  }

  entryModule.modeNames.sort();

  if (entryModule.modeNames.length === 1) {
    const modeName = entryModule.modeNames[0];
    return getModeBundleId(lazyModules, modeName, entryModule.entryKey);
  }

  const bundleIds: d.ModeBundleIds = {};
  entryModule.modeNames.forEach(modeName => {
    bundleIds[modeName] = getModeBundleId(lazyModules, modeName, entryModule.entryKey);
  });
  return JSON.stringify(bundleIds);
}

function getModeBundleId(lazyModules: d.LazyModuleOutput[], modeName: string, entryKey: string) {
  const lazyModule = lazyModules.find(lazyModule => {
    return lazyModule.entryKey === entryKey && lazyModule.modeName === modeName;
  });
  if (lazyModule == null) {
    throw new Error(`unable to find lazy module, entry key: ${entryKey}, mode: ${modeName}`);
  }
  if (typeof lazyModule.bundleId !== 'string') {
    throw new Error(`invalid bundle id`);
  }
  return `"` + lazyModule.bundleId + `"`;
}
