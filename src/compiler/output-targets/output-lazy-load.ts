import * as d from '@declarations';
import { generateLazyBundles } from '../component-lazy/generate-lazy-bundles';
import { generateLazyLoadedAppCore } from '../app-core/generate-lazy-core';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { pathJoin } from '@utils';


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

  const cmps = buildCtx.moduleFiles.reduce((cmps, m) => {
    cmps.push(...m.cmps);
    return cmps;
  }, [] as d.ComponentCompilerMeta[]);

  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = true;
  build.es5 = false;
  build.slotPolyfill = false;
  build.polyfills = false;
  build.prerenderClientSide = false;
  build.prerenderServerSide = false;

  updateBuildConditionals(config, build);

  const lazyModules = await generateLazyBundles(config, compilerCtx, buildCtx, outputTargets, build);
  if (lazyModules != null) {
    const outputText = await generateLazyLoadedAppCore(config, compilerCtx, buildCtx, build, lazyModules);

    await writeLazyLoadCoreOutputs(config, compilerCtx, outputTargets, outputText);
  }

  timespan.finish(`generate app lazy components finished`);
}


async function writeLazyLoadCoreOutputs(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetBuild[], outputText: string) {
  const promises = outputTargets.map(async outputTarget => {
    await writeLazyLoadCoreOutput(config, compilerCtx, outputTarget, outputText);
  });

  await Promise.all(promises);
}


async function writeLazyLoadCoreOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetBuild, outputText: string) {
  const fileName = `${config.fsNamespace}.js`;

  const filePath = pathJoin(config, outputTarget.buildDir, fileName);

  await compilerCtx.fs.writeFile(filePath, outputText);
}


export const MIN_FOR_LAZY_LOAD = 6;
