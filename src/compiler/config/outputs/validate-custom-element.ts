import * as d from '../../../declarations';
import { getAbsolutePath } from '../config-utils';
import { isBoolean } from '@utils';
import { isOutputTargetDistCustomElements } from '../../output-targets/output-utils';

export const validateCustomElement = (config: d.Config, userOutputs: d.OutputTarget[]) => {
  return userOutputs.filter(isOutputTargetDistCustomElements).map(o => {
    const outputTarget = {
      ...o,
      dir: getAbsolutePath(config, o.dir || 'dist/components'),
    };
    if (!isBoolean(outputTarget.empty)) {
      outputTarget.empty = true;
    }
    return outputTarget;
  });
};
