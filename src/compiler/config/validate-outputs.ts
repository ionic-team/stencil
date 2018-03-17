import * as d from '../../declarations';
import { validateDocs } from './validate-docs';
import { validateOutputTargetDist } from './validate-outputs-dist';
import { validateOutputTargetWww } from './validate-outputs-www';
import { validateResourcesUrl } from './validate-resources-url';
import { validateServiceWorker } from './validate-service-worker';
import { validateStats } from './validate-stats';
import { _deprecatedToMultipleTarget } from './_deprecated-validate-multiple-targets';


export function validateOutputTargets(config: d.Config) {

  // setup outputTargets from deprecated config properties
  _deprecatedToMultipleTarget(config);

  if (Array.isArray(config.outputTargets)) {
    config.outputTargets.forEach(outputTarget => {
      if (typeof outputTarget.type !== 'string') {
        outputTarget.type = 'www';
      }

      outputTarget.type = outputTarget.type.trim().toLowerCase() as any;

      if (!VALID_TYPES.includes(outputTarget.type)) {
        throw new Error(`invalid outputTarget type "${outputTarget.type}". Valid target types: ${VALID_TYPES.join(', ')}`);
      }
    });
  }

  validateOutputTargetWww(config);
  validateOutputTargetDist(config);
  validateDocs(config);
  validateStats(config);

  if (!config.outputTargets || config.outputTargets.length === 0) {
    throw new Error(`outputTarget required`);
  }

  config.outputTargets.forEach(outputTarget => {
    validateResourcesUrl(outputTarget);
    validateServiceWorker(config, outputTarget);
  });
}


const VALID_TYPES = ['dist', 'docs', 'stats', 'www'];
