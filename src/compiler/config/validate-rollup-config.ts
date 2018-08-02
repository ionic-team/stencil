import * as d from '../../declarations';
import { isObject, pluck } from '../../util/helpers';

export function validateRollupConfig(config: d.Config) {
  const cleanRollupConfig = getCleanRollupConfig(config.rollupConfig);
  config.rollupConfig = cleanRollupConfig;
}

function getCleanRollupConfig(rollupConfig: d.RollupConfig): d.RollupConfig {
  let cleanRollupConfig = DEFAULT_ROLLUP_CONFIG;

  if (!rollupConfig || !isObject(rollupConfig)) {
    return cleanRollupConfig;
  }

  if (rollupConfig.inputOptions && isObject(rollupConfig.inputOptions)) {
    cleanRollupConfig = {
      ...cleanRollupConfig,
      inputOptions: pluck(rollupConfig.inputOptions, ['context', 'moduleContext']),
    };
  }

  if (rollupConfig.outputOptions && isObject(rollupConfig.outputOptions)) {
    cleanRollupConfig = {
      ...cleanRollupConfig,
      outputOptions: pluck(rollupConfig.outputOptions, ['globals']),
    };
  }

  return cleanRollupConfig;
}

const DEFAULT_ROLLUP_CONFIG: d.RollupConfig = {
  inputOptions: {},
  outputOptions: {}
};
