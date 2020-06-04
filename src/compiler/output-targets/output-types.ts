import * as d from '../../declarations';
import { generateTypes } from '../types/generate-types';
import { isOutputTargetDistTypes } from './output-utils';

export const outputTypes = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistTypes);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate types started`, true);

  await Promise.all(outputTargets.map(outputsTarget => generateTypes(config, compilerCtx, buildCtx, outputsTarget)));

  timespan.finish(`generate types finished`);
};
