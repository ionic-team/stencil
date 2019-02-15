import * as d from '@declarations';
import { sys } from '@sys';
import { isOutputTargetStats } from '../output-targets/output-utils';


export function validateStats(config: d.Config) {

  if (config.flags.stats) {
    const hasOutputTarget = config.outputTargets.some(isOutputTargetStats);
    if (!hasOutputTarget) {
      config.outputTargets.push({
        type: 'stats'
      });
    }
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetStats);
  outputTargets.forEach(outputTarget => {
    validateStatsOutputTarget(config, outputTarget);
  });
}


function validateStatsOutputTarget(config: d.Config, outputTarget: d.OutputTargetStats) {
  if (!outputTarget.file) {
    outputTarget.file = DEFAULT_JSON_FILE_NAME;
  }

  if (!sys.path.isAbsolute(outputTarget.file)) {
    outputTarget.file = sys.path.join(config.rootDir, outputTarget.file);
  }
}


const DEFAULT_JSON_FILE_NAME = 'stencil-stats.json';
