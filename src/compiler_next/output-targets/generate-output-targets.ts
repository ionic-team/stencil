import * as d from '../../declarations';
import { customElementOutput } from './component-custom-element/custom-element-output';
import { isOutputTargetCustomElementNext, isOutputTargetLazyNext } from '../../compiler/output-targets/output-utils';
import { lazyOutput } from './component-lazy/lazy-output';
import ts from 'typescript';


export const generateOutputTargets = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram) => {
  const timeSpan = buildCtx.createTimeSpan('generate outputs started', true);

  const outputPromises: Promise<any>[] = [];

  const customElementOutputTargets = config.outputTargets.filter(isOutputTargetCustomElementNext);
  if (customElementOutputTargets.length > 0) {
    outputPromises.push(
      customElementOutput(config, compilerCtx, buildCtx, tsBuilder, customElementOutputTargets)
    );
  }

  const lazyOutputTargets = config.outputTargets.filter(isOutputTargetLazyNext);
  if (lazyOutputTargets.length > 0) {
    outputPromises.push(
      lazyOutput(config, compilerCtx, buildCtx, tsBuilder, lazyOutputTargets)
    );
  }

  await Promise.all(outputPromises);

  timeSpan.finish('generate outputs finished');
};
