import * as d from '../../declarations';
import { customElementsBundleOutput } from './component-module/custom-module-output';
import { customElementOutput } from './component-custom-element/custom-element-output';
import { lazyOutput } from './component-lazy/lazy-output';
import { outputAngular } from '../../compiler/output-targets/output-angular';
import { outputCopy } from './copy/output-copy';
import { outputDocs } from '../../compiler/output-targets/output-docs';
import { outputLazyLoader } from '../../compiler/output-targets/output-lazy-loader';
import { outputWww } from '../../compiler/output-targets/output-www';


export const generateOutputTargets = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const timeSpan = buildCtx.createTimeSpan('generate outputs started', true);

  const changedModuleFiles = Array.from(compilerCtx.changedModules)
    .map(filename => compilerCtx.moduleMap.get(filename));
  compilerCtx.changedModules.clear();

  await Promise.all([
    lazyOutput(config, compilerCtx, buildCtx),
    outputWww(config, compilerCtx, buildCtx),
    customElementsBundleOutput(config, compilerCtx, buildCtx),
    customElementOutput(config, compilerCtx, buildCtx, changedModuleFiles),
    outputAngular(config, compilerCtx, buildCtx),
    outputDocs(config, compilerCtx, buildCtx),
    outputLazyLoader(config, compilerCtx),
    outputCopy(config, compilerCtx, buildCtx),
  ]);

  timeSpan.finish('generate outputs finished');
};
