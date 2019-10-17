import * as d from '../../declarations';
import { customElementsBundleOutput } from './component-module/custom-module-output';
import { lazyOutput } from './component-lazy/lazy-output';
import ts from 'typescript';
import { collectionOutput } from './component-collection/collection-output';
import { customElementOutput } from './component-custom-element/custom-element-output';
import { outputAngular } from '../../compiler/output-targets/output-angular';
import { outputDocs } from '../../compiler/output-targets/output-docs';
import { outputLazyLoader } from '../../compiler/output-targets/output-lazy-loader';
import { outputWww } from '../../compiler/output-targets/output-www';


export const generateOutputTargets = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram) => {
  const timeSpan = buildCtx.createTimeSpan('generate outputs started', true);

  const changedModuleFiles = Array.from(compilerCtx.changedModules)
    .map(filename => compilerCtx.moduleMap.get(filename));
  compilerCtx.changedModules.clear();

  await Promise.all([
    appOutput(config, compilerCtx, buildCtx, tsBuilder),
    customElementsBundleOutput(config, compilerCtx, buildCtx, tsBuilder),
    collectionOutput(config, compilerCtx, buildCtx, changedModuleFiles),
    customElementOutput(config, compilerCtx, buildCtx, changedModuleFiles),
    outputAngular(config, compilerCtx, buildCtx),
    outputDocs(config, compilerCtx, buildCtx),
    outputLazyLoader(config, compilerCtx),
  ]);

  timeSpan.finish('generate outputs finished');
};

const appOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram) => {
  await lazyOutput(config, compilerCtx, buildCtx, tsBuilder);
  await outputWww(config, compilerCtx, buildCtx);
};
