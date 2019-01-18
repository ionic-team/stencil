import * as d from '@declarations';
import { bundleAppCore } from './bundle-app-core';
import { formatComponentRuntimeMeta } from './format-component-runtime-meta';
import { optimizeAppCoreBundle } from './optimize-app-core';


export async function generateLazyLoadedAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, lazyModules: d.LazyModuleOutput[]) {
  const c: string[] = [];

  const cmpRuntimeData = formatLazyComponentRuntimeData(buildCtx.entryModules, lazyModules);

  c.push(`import { bootstrapLazy } from '${build.coreImportPath}';`);

  c.push(`bootstrapLazy(${cmpRuntimeData});`);

  const exportFns: string[] = ['registerLazyInstance'];

  if (build.vdomRender) {
    exportFns.push('h');
  }

  if (build.style) {
    exportFns.push('registerStyle');
  }

  c.push(`export { ${exportFns.join(', ')} } from '${build.coreImportPath}';`);

  const appCoreBundleInput = c.join('\n');

  // bundle up the input into a nice pretty file
  const files = new Map();
  const appCoreBundleOutput = await bundleAppCore(config, compilerCtx, buildCtx, build, files, appCoreBundleInput);
  if (buildCtx.hasError) {
    return null;
  }

  const results = await optimizeAppCoreBundle(config, compilerCtx, build, appCoreBundleOutput);
  buildCtx.diagnostics.push(...results.diagnostics);

  return results.output;
}


function formatLazyComponentRuntimeData(entryModules: d.EntryModule[], lazyModules: d.LazyModuleOutput[]) {
  // [[{ios: 'abc12345', md: 'dec65432'}, {tagName: 'ion-icon', members: []}]]

  const lazyBundles = entryModules.map(entryModule => {
    const bundleId = getBundleId(entryModule, lazyModules);
    const cmps = entryModule.moduleFiles.filter(m => m.cmpCompilerMeta != null).map(m => {
      return m.cmpCompilerMeta;
    });

    // NOT using JSON.stringify so that properties can get renamed/minified
    const str = `[${
      bundleId
    }, [${
      cmps.map(cmp => {
        return formatComponentRuntimeMeta(cmp, true);
      }).join(', ')
    }]]`;

    return str;
  });

  return `[` + lazyBundles.join(', ') + `]`;
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
