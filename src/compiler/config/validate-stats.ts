import * as d from '@declarations';
import { sys } from '@sys';


export function validateStats(config: d.Config) {

  if (config.flags.stats) {
    const hasOutputTarget = config.outputTargets.some(o => o.type === 'stats');
    if (!hasOutputTarget) {
      config.outputTargets.push({
        type: 'stats'
      });
    }
  }

  const outputTargets = config.outputTargets.filter(o => o.type === 'stats') as d.OutputTargetStats[];

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
