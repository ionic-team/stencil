import type * as d from '../../../declarations';
import { isAbsolute, join } from 'path';
import { STATS, isOutputTargetStats } from '../../output-targets/output-utils';

export const validateStats = (userConfig: d.Config, userOutputs: d.OutputTarget[]) => {
  const outputTargets: d.OutputTargetStats[] = [];

  if (userConfig.flags.stats) {
    const hasOutputTarget = userOutputs.some(isOutputTargetStats);
    if (!hasOutputTarget) {
      outputTargets.push({
        type: STATS,
      });
    }
  }

  outputTargets.push(...userOutputs.filter(isOutputTargetStats));
  outputTargets.forEach((outputTarget) => {
    if (!outputTarget.file) {
      outputTarget.file = 'stencil-stats.json';
    }

    if (!isAbsolute(outputTarget.file)) {
      outputTarget.file = join(userConfig.rootDir, outputTarget.file);
    }
  });

  return outputTargets;
};
