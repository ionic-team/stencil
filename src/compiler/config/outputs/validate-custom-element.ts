import type { Config, OutputTarget, OutputTargetDistCustomElements, OutputTargetCopy } from '../../../declarations';
import { getAbsolutePath } from '../config-utils';
import { isBoolean } from '@utils';
import { COPY, isOutputTargetDistCustomElements } from '../../output-targets/output-utils';
import { validateCopy } from '../validate-copy';

export const validateCustomElement = (config: Config, userOutputs: OutputTarget[]) => {
  return userOutputs.filter(isOutputTargetDistCustomElements).reduce((arr, o) => {
    const outputTarget = {
      ...o,
      dir: getAbsolutePath(config, o.dir || 'dist/components'),
    };
    if (!isBoolean(outputTarget.empty)) {
      outputTarget.empty = true;
    }
    if (!isBoolean(outputTarget.externalRuntime)) {
      outputTarget.externalRuntime = true;
    }
    outputTarget.copy = validateCopy(outputTarget.copy, []);

    if (outputTarget.copy.length > 0) {
      arr.push({
        type: COPY,
        dir: config.rootDir,
        copy: [...outputTarget.copy],
      });
    }
    arr.push(outputTarget);

    return arr;
  }, [] as (OutputTargetDistCustomElements | OutputTargetCopy)[]);
};