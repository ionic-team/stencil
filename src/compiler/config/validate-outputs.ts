import { Config } from '../../declarations';
import { validateDistOutputTarget } from './validate-outputs-dist';
import { validateDocs } from './validate-docs';
import { validatePrerender } from './validate-prerender';
import { validateResourcePath } from './validate-resource-path';
import { validateServiceWorker } from './validate-service-worker';
import { validateStats } from './validate-stats';
import { validateWwwOutputTarget } from './validate-outputs-www';
import { _deprecatedToMultipleTarget } from './_deprecated-validate-multiple-targets';


export function validateOutputTargets(config: Config) {

  // setup outputTargets from deprecated config properties
  _deprecatedToMultipleTarget(config);

  validateWwwOutputTarget(config);
  validateDistOutputTarget(config);
  validateDocs(config);
  validateStats(config);

  if (!config.outputTargets || config.outputTargets.length === 0) {
    throw new Error(`outputTarget required`);
  }

  config.outputTargets.forEach(outputTarget => {
    validateResourcePath(outputTarget);
    validatePrerender(config, outputTarget);
    validateServiceWorker(config, outputTarget);
  });
}
