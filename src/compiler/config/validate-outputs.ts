import * as d from '../../declarations';
import { validateOutputStats } from './validate-output-stats';
import { validateOutputTargetDist } from './validate-outputs-dist';
import { validateOutputTargetDistHydrateScript } from './validate-outputs-hydrate-script';
import { validateOutputTargetWww } from './validate-outputs-www';
import { validateOutputTargetDistCollection } from './validate-outputs-dist-collection';
import { validateOutputTargetDistModule } from './validate-outputs-dist-module';
import { getPluginOutputTypeNames } from '../output-plugins/output-plugin-utils';
import { validatePluginOutputs } from '../output-plugins/validate';
import { VALID_TYPES, WWW } from '../output-targets/output-utils';
import { _deprecatedToMultipleTarget } from './_deprecated-validate-multiple-targets';


export function validateOutputTargets(config: d.Config) {

  // setup outputTargets from deprecated config properties
  _deprecatedToMultipleTarget(config);

  if (Array.isArray(config.outputTargets)) {
    const validTargetTypes = VALID_TYPES.slice().concat(getPluginOutputTypeNames(config)).sort();

    config.outputTargets.forEach(outputTarget => {
      if (typeof outputTarget.type !== 'string') {
        outputTarget.type = WWW;
      }

      outputTarget.type = outputTarget.type.trim().toLowerCase() as any;

      if (!validTargetTypes.includes(outputTarget.type)) {
        throw new Error(`invalid outputTarget type "${outputTarget.type}". Valid outputTarget types include: ${validTargetTypes.map(t => `"${t}"`).join(', ')}`);
      }
    });
  }

  validateOutputTargetWww(config);
  validateOutputTargetDist(config);
  validateOutputTargetDistCollection(config);
  validateOutputTargetDistHydrateScript(config);
  validateOutputTargetDistModule(config);
  validateOutputStats(config);

  // Validate Plugins for outputs
  validatePluginOutputs(config);

  if (!config.outputTargets || config.outputTargets.length === 0) {
    throw new Error(`outputTarget required`);
  }
}
