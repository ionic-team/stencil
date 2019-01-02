import * as d from '../../declarations';
import { generateAppCore } from '../app-core/generate-app-core';
import { getAppBuildCorePath } from './output-file-naming';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';


export async function generateLazyLoads(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetBuild[]).filter(o => {
    return ((o.type === 'www' || o.type === 'dist') && buildCtx.moduleFiles.length >= MIN_FOR_LAZY_LOAD);
  });

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate app lazy components started`, true);

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
  }

  timespan.finish(`generate app lazy components finished`);
}


async function writeLazyLoadCore(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetBuild[], outputText: string) {
  const promises = outputTargets.map(async outputTarget => {
    const filePath = getAppBuildCorePath(config, outputTarget);
    await compilerCtx.fs.writeFile(filePath, outputText);
  });

  await Promise.all(promises);
}


export const MIN_FOR_LAZY_LOAD = 6;
