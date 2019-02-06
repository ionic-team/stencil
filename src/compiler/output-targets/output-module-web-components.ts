import * as d from '@declarations';
import { generateNativeAppCore } from '../component-native/generate-native-core';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { writeNativeBundled } from '../component-native/write-native-bundled';


export async function outputModuleWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTarget[]).filter(o => {
    return (o.type === 'dist');
  });

  if (outputTargets.length === 0) {
    return;
  }

  return generateModuleWebComponents(config, compilerCtx, buildCtx, outputTargets as any);
}


export async function generateModuleWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetWebComponent[]) {
  await buildCtx.stylesPromise;

  const timespan = buildCtx.createTimeSpan(`generate module web components started`, true);

  const cmps = buildCtx.moduleFiles.reduce((cmps, m) => {
    cmps.push(...m.cmps);
    return cmps;
  }, [] as d.ComponentCompilerMeta[]);

  const build = getBuildFeatures(cmps) as d.Build;

  const rollupResults = await generateModuleWebComponentCore(config, compilerCtx, buildCtx, build, cmps);

  if (Array.isArray(rollupResults) && !buildCtx.shouldAbort) {
    await buildCtx.stylesPromise;

    await writeNativeBundled(config, compilerCtx, buildCtx, build, outputTargets, cmps, rollupResults);
  }

  timespan.finish(`generate module web components finished`);
}


function generateModuleWebComponentCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmps: d.ComponentCompilerMeta[]) {
  build.lazyLoad = false;
  build.es5 = false;
  build.polyfills = false;
  build.prerenderClientSide = false;
  build.prerenderServerSide = false;

  updateBuildConditionals(config, build);

  return generateNativeAppCore(config, compilerCtx, buildCtx, cmps, build);
}
