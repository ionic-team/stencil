import * as d from '../../declarations';
import { validateOutputTargetDist } from './validate-outputs-dist';
import { validateOutputTargetHydrate } from './validate-outputs-hydrate';
import { validateOutputTargetWww } from './validate-outputs-www';
import { validateOutputTargetDistCollection } from './validate-outputs-dist-collection';
import { validateOutputTargetDistModule } from './validate-outputs-dist-module';
import { getPluginOutputTypeNames } from '../output-plugins/output-plugin-utils';
import { validatePluginOutputs } from '../output-plugins/validate';
import { validateStats } from './validate-stats';
import { _deprecatedToMultipleTarget } from './_deprecated-validate-multiple-targets';


export function validateOutputTargets(config: d.Config) {

  // setup outputTargets from deprecated config properties
  _deprecatedToMultipleTarget(config);

  // Validate Plugins for outputs
  validatePluginOutputs(config);

  if (Array.isArray(config.outputTargets)) {
    const validTargetTypes = VALID_TYPES.concat(getPluginOutputTypeNames(config));

    config.outputTargets.forEach(outputTarget => {
      if (typeof outputTarget.type !== 'string') {
        outputTarget.type = 'www';
      }

      outputTarget.type = outputTarget.type.trim().toLowerCase() as any;

      if (!validTargetTypes.includes(outputTarget.type)) {
        throw new Error(`invalid outputTarget type "${outputTarget.type}". Valid target types: ${validTargetTypes.join(', ')}`);
      }
    });
  }

  validateOutputTargetWww(config);
  validateOutputTargetDist(config);
  validateOutputTargetHydrate(config);
  validateOutputTargetDistCollection(config);
  validateOutputTargetHydrate(config);
  validateOutputTargetDistModule(config);

  validateStats(config);


  if (!config.outputTargets || config.outputTargets.length === 0) {
    throw new Error(`outputTarget required`);
  }
}

const VALID_TYPES = [
  'dist',
  'dist-collection',
  'dist-module',
  'dist-selfcontained',
  'hydrate',
  'stats',
  'www',
];
