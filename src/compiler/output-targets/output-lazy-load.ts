import * as d from '../../declarations';
import { generateAppCore } from '../app-core/generate-app-core';
import { generateBundles } from '../bundle/generate-bundles';
import { getAppBuildCorePath } from './output-file-naming';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';


export async function generateLazyLoad(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[], rawModules: d.DerivedModule[]) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetBuild[]).filter(o => {
    return o.type === 'www' || o.type === 'dist';
  });

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate lazy load started`, true);

  const promises = [
    generateBundles(config, compilerCtx, buildCtx, entryModules, rawModules),
    generateLazyLoadCore(config, compilerCtx, buildCtx, outputTargets)
  ];

  await Promise.all(promises);

  timespan.finish(`generate lazy load finished`);
}


async function generateLazyLoadCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[]) {
  const timespan = buildCtx.createTimeSpan(`generate lazy load core started`, true);

  const appModuleFiles = buildCtx.moduleFiles.filter(m => m.cmpCompilerMeta);

  const build = getBuildFeatures(buildCtx.moduleFiles, appModuleFiles) as d.Build;

  build.lazyLoad = true;
  build.es5 = false;
  build.slotPolyfill = false;
  build.polyfills = false;
  build.prerenderClientSide = false;
  build.prerenderServerSide = false;

  updateBuildConditionals(config, build);

  const outputText = await generateAppCore(config, compilerCtx, buildCtx, build);

  if (!buildCtx.hasError && typeof outputText === 'string') {
    await writeLazyLoadCore(config, compilerCtx, outputTargets, outputText);

    timespan.finish(`generate lazy load core finished`);
  }
}


async function writeLazyLoadCore(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetBuild[], outputText: string) {
  const promises = outputTargets.map(async outputTarget => {
    const filePath = getAppBuildCorePath(config, outputTarget);
    await compilerCtx.fs.writeFile(filePath, outputText);
  });

  await Promise.all(promises);
}
