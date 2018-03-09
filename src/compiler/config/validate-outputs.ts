import { Config } from '../../declarations';
import { validateDistOutputTarget } from './validate-outputs-dist';
import { validatePrerender } from './validate-prerender';
import { validatePublicPath } from './validate-public-path';
import { validateServiceWorker } from './validate-service-worker';
import { validateWwwOutputTarget } from './validate-outputs-www';
import { _deprecatedToMultipleTarget } from './_deprecated-validate-multiple-targets';


export function validateOutputTargets(config: Config) {

  // setup outputTargets from deprecated config properties
  _deprecatedToMultipleTarget(config);

  validateWwwOutputTarget(config);
  validateDistOutputTarget(config);

  if (!config.outputTargets || config.outputTargets.length === 0) {
    throw new Error(`outputTarget required`);
  }

  config.outputTargets.forEach(outputTarget => {
    validatePublicPath(config, outputTarget);
    validatePrerender(config, outputTarget);
    validateServiceWorker(config, outputTarget);
  });
}
