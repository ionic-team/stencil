import * as d from '../../../declarations';
import { getAbsolutePath } from '../config-utils';
import { isBoolean } from '@utils';
import { isOutputTargetDistCustomElementsBundle } from '../../output-targets/output-utils';

export const validateCustomElementBundle = (config: d.Config, userOutputs: d.OutputTarget[]) => {
  return userOutputs.filter(isOutputTargetDistCustomElementsBundle).map(o => {
    const outputTarget = {
      ...o,
      dir: getAbsolutePath(config, o.dir || 'dist/custom-elements-bundle'),
    };
    if (!isBoolean(outputTarget.empty)) {
      outputTarget.empty = true;
    }
    return outputTarget;
  });
};
