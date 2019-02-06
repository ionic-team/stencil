import * as d from '@declarations';
import { generateNativeAppCore } from '../component-native/generate-native-core';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { writeNativeSelfContained } from '../component-native/write-native-self-contained';


export async function outputSelfContainedWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetSelfContained[]).filter(o => {
    return (o.type === 'selfcontained');
  });

  if (outputTargets.length === 0) {
    return;
  }

  return generateSelfContainedWebComponents(config, compilerCtx, buildCtx, outputTargets);
}


export async function generateSelfContainedWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetSelfContained[]) {
  await buildCtx.stylesPromise;

  const timespan = buildCtx.createTimeSpan(`generate self-contained web components started`, true);

  await Promise.all(buildCtx.moduleFiles.map(moduleFile => {
    return Promise.all(moduleFile.cmps.map(cmp => {
      return generateSelfContainedWebComponent(config, compilerCtx, buildCtx, outputTargets, cmp);
    }));
  }));

  timespan.finish(`generate self-contained web components finished`);
}


async function generateSelfContainedWebComponent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetSelfContained[], cmp: d.ComponentCompilerMeta) {
  const cmps = [cmp];

  const build = getBuildFeatures(cmps) as d.Build;

  const outputText = await generateSelfContainedCore(config, compilerCtx, buildCtx, build, cmps);

  if (!buildCtx.shouldAbort && typeof outputText === 'string') {
    await writeNativeSelfContained(config, compilerCtx, buildCtx, build, outputTargets, cmps, outputText);
  }
}


function generateSelfContainedCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmps: d.ComponentCompilerMeta[]) {
  build.lazyLoad = false;
  build.es5 = false;
  build.polyfills = false;
  build.prerenderClientSide = false;
  build.prerenderServerSide = false;

  updateBuildConditionals(config, build);

  return generateNativeAppCore(config, compilerCtx, buildCtx, cmps, build);
}
