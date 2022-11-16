import { isObject, pluck } from '@utils';

import type * as d from '../../declarations';

export const validateRollupConfig = (config: d.UnvalidatedConfig): void => {
  const cleanRollupConfig = getCleanRollupConfig(config.rollupConfig);
  config.rollupConfig = cleanRollupConfig;
};

const getCleanRollupConfig = (rollupConfig: d.RollupConfig): d.RollupConfig => {
  let cleanRollupConfig = DEFAULT_ROLLUP_CONFIG;

  if (!rollupConfig || !isObject(rollupConfig)) {
    return cleanRollupConfig;
  }

  if (rollupConfig.inputOptions && isObject(rollupConfig.inputOptions)) {
    cleanRollupConfig = {
      ...cleanRollupConfig,
      inputOptions: pluck(rollupConfig.inputOptions, ['context', 'moduleContext', 'treeshake']),
    };
  }

  if (rollupConfig.outputOptions && isObject(rollupConfig.outputOptions)) {
    cleanRollupConfig = {
      ...cleanRollupConfig,
      outputOptions: pluck(rollupConfig.outputOptions, ['globals']),
    };
  }

  return cleanRollupConfig;
};

const DEFAULT_ROLLUP_CONFIG: d.RollupConfig = {
  inputOptions: {},
  outputOptions: {},
};
