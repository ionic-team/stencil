import * as d from '../../declarations';
import { STATS, isOutputTargetStats } from '../output-targets/output-utils';


export function validateOutputStats(config: d.Config) {

  if (config.flags.stats) {
    const hasOutputTarget = config.outputTargets.some(isOutputTargetStats);
    if (!hasOutputTarget) {
      config.outputTargets.push({
        type: STATS
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

  if (!config.sys.path.isAbsolute(outputTarget.file)) {
    outputTarget.file = config.sys.path.join(config.rootDir, outputTarget.file);
  }
}


const DEFAULT_JSON_FILE_NAME = 'stencil-stats.json';
