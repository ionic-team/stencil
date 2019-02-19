import * as d from '@declarations';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { getComponentsFromModules, isOutputTargetDist } from './output-utils';
import { bundleApp } from '../app-core/bundle-app-core';
import { sys } from '@sys';


export async function outputModuleWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDist);
  if (outputTargets.length === 0) {
    return;
  }

  return generateModuleWebComponents(config, compilerCtx, buildCtx, outputTargets);
}

export async function generateModuleWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[]) {
  await buildCtx.stylesPromise;

  const timespan = buildCtx.createTimeSpan(`generate module web components started`, true);

  const cmps = getComponentsFromModules(buildCtx.moduleFiles);

  const build = getBuildConditionals(config, cmps);

  const rollupResults = await bundleNativeModule(config, compilerCtx, buildCtx, build);

  if (Array.isArray(rollupResults) && !buildCtx.shouldAbort) {
    if (rollupResults.length !== 1) {
      console.error('not a single file');
    } else {
      await Promise.all(outputTargets.map(async outputTarget => {
        const filePath = sys.path.join(outputTarget.buildDir, 'modules', config.fsNamespace + '.mjs');
        await compilerCtx.fs.writeFile(filePath, rollupResults[0].code);
      }));
    }
  }

  timespan.finish(`generate module web components finished`);
}


function getBuildConditionals(config: d.Config, cmps: d.ComponentCompilerMeta[]) {
  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = false;
  build.es5 = false;
  build.polyfills = false;
  build.hydrateClientSide = false;
  build.hydrateServerSide = false;

  updateBuildConditionals(config, build);
  return build;
}

export async function bundleNativeModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const bundleCoreOptions: d.BundleCoreOptions = {
    entryInputs: {},
    moduleFormats: ['esm'],
    mainEntry: generateEntryPoint(buildCtx.entryModules)
  };
  return bundleApp(config, compilerCtx, buildCtx, build, bundleCoreOptions);
}

function generateEntryPoint(entryModules: d.EntryModule[]) {
  return entryModules.map(entry => {
    return `export { ${
      entry.cmps.map(cmp => cmp.componentClassName).join(', ')
     } } from '${entry.entryKey}';`;
  }).join('\n');
}
