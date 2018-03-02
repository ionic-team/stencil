import { Config, RawConfig } from '../../declarations';
import { DEFAULT_DIST_DIR, DEFAULT_WWW_DIR } from './validate-paths';

/**
 * DEPRECATED "config" generateWWW, wwwDir, emptyWWW, generateDistribution, distDir, emptyDist
 * since 0.7.0, 2018-03-02
 */
export function _deprecatedToMultipleTarget(config: RawConfig): Config {
  const {
    generateWWW,
    wwwDir,
    emptyWWW,
    generateDistribution,
    distDir,
    emptyDist,
    ...newConfig
  } = config;
  let {
    outputTargets
  } = config;

  if (outputTargets === undefined) {
    outputTargets = {};

    if (generateWWW !== false) {
      outputTargets['www'] = {
        dir: wwwDir || DEFAULT_WWW_DIR,
        emptyDir: !(emptyWWW === false)
      };
    }

    if (generateDistribution !== false) {
      outputTargets['distribution'] = {
        dir: distDir || DEFAULT_DIST_DIR,
        emptyDir: !(emptyDist === false)
      };
    }
  }

  return {
    ...newConfig,
    outputTargets
  };
}
