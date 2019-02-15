import * as d from '@declarations';
import { generateLazyLoadedApp } from '../component-lazy/generate-lazy-app';
import { isOutputTargetBuild } from './output-utils';


export async function outputApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetBuild);
  if (outputTargets.length === 0) {
    return;
  }

  const cmps = buildCtx.moduleFiles.reduce((cmps, m) => {
    cmps.push(...m.cmps);
    return cmps;
  }, [] as d.ComponentCompilerMeta[]);

  if (cmps.length > MIN_FOR_LAZY_LOAD) {
    // TODO
  }

  return generateLazyLoadedApp(config, compilerCtx, buildCtx, outputTargets, cmps);
}



export const MIN_FOR_LAZY_LOAD = 6;
