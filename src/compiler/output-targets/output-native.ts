import * as d from '@declarations';
import { generateNativeAppCore } from '../component-native/generate-native-core';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { MIN_FOR_LAZY_LOAD } from './output-lazy-load';
import { writeNativeBundled } from '../component-native/write-native-bundled';
import { writeNativeSelfContained } from '../component-native/write-native-self-contained';


export async function generateNative(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const selfContainedOutputTargets = (config.outputTargets as d.OutputTargetWebComponent[]).filter(o => {
    return (o.type === 'webcomponent');
  });

  const bundledOutputTargets = (config.outputTargets as d.OutputTargetBuild[]).filter(o => {
    if (o.type === 'www' || o.type === 'dist') {
      if (buildCtx.moduleFiles.length < MIN_FOR_LAZY_LOAD) {
        return true;
      }
    }
    return false;
  });

  if (selfContainedOutputTargets.length === 0 && bundledOutputTargets.length === 0) {
    return;
  }

  await buildCtx.stylesPromise;

  const promises = [
    generateSelfContainedWebComponents(config, compilerCtx, buildCtx, buildCtx.moduleFiles, selfContainedOutputTargets),
    generateBundledWebComponents(config, compilerCtx, buildCtx, buildCtx.moduleFiles, bundledOutputTargets as any)
  ];

  await Promise.all(promises);
}


async function generateSelfContainedWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFiles: d.Module[], outputTargets: d.OutputTargetWebComponent[]) {
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate self-contained web components started`, true);

  const promises: Promise<any>[] = [];

  moduleFiles.forEach(moduleFile => {
    const p = moduleFile.cmps.map(async cmp => {
      const appCmps = [cmp];

      const build = getBuildFeatures(appCmps) as d.Build;

      const outputText = await generateWebComponentCore(config, compilerCtx, buildCtx, build, appCmps);

      if (!buildCtx.shouldAbort && typeof outputText === 'string') {
        await writeNativeSelfContained(config, compilerCtx, buildCtx, build, outputTargets, appCmps, outputText);
      }
    });
    promises.push(...p);
  });

  await Promise.all(promises);

  timespan.finish(`generate self-contained web components finished`);
}


async function generateBundledWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFiles: d.Module[], outputTargets: d.OutputTargetWebComponent[]) {
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate self-contained web components started`, true);

  const cmps = moduleFiles.reduce((cmps, m) => {
    cmps.push(...m.cmps);
    return cmps;
  }, [] as d.ComponentCompilerMeta[]);

  const build = getBuildFeatures(cmps) as d.Build;

  const rollupResults = await generateWebComponentCore(config, compilerCtx, buildCtx, build, cmps);

  if (Array.isArray(rollupResults) && !buildCtx.shouldAbort) {
    await buildCtx.stylesPromise;

    await writeNativeBundled(config, compilerCtx, buildCtx, build, outputTargets, cmps, rollupResults);
  }

  timespan.finish(`generate self-contained web components finished`);
}


function generateWebComponentCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmps: d.ComponentCompilerMeta[]) {
  build.lazyLoad = false;
  build.es5 = false;
  build.slotPolyfill = false;
  build.polyfills = false;
  build.prerenderClientSide = false;
  build.prerenderServerSide = false;

  updateBuildConditionals(config, build);

  return generateNativeAppCore(config, compilerCtx, buildCtx, cmps, build);
}
