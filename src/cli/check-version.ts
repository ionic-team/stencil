import type { InternalStrictConfig } from '../declarations';
import { isFunction } from '@utils';

export const startCheckVersion = async (config: InternalStrictConfig, currentVersion: string) => {
  if (config.devMode && !config.flags.ci && !currentVersion.includes('-dev.') && isFunction(config.sys.checkVersion)) {
    return config.sys.checkVersion(config.logger, currentVersion);
  }
  return null;
};

export const printCheckVersionResults = async (versionChecker: Promise<() => void>) => {
  if (versionChecker) {
    const checkVersionResults = await versionChecker;
    if (isFunction(checkVersionResults)) {
      checkVersionResults();
    }
  }
};
