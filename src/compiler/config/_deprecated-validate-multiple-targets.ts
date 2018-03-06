import { Config } from '../../declarations';
import {
  DEFAULT_BUILD_DIR,
  DEFAULT_COLLECTION_DIR,
  DEFAULT_DIST_DIR,
  DEFAULT_INDEX_HTML,
  DEFAULT_WWW_DIR,
} from './validate-paths';

/**
 * DEPRECATED "config" generateWWW, wwwDir, emptyWWW, generateDistribution, distDir, emptyDist
 * since 0.7.0, 2018-03-02
 */
export function _deprecatedToMultipleTarget(config: Config) {
  let {
    outputTargets
  } = config;

  if (outputTargets === undefined) {
    outputTargets = {};

    if (config.generateWWW !== false) {
      outputTargets['www'] = {
        emptyDir: !(config.emptyWWW === false),
        dir: config.wwwDir || DEFAULT_WWW_DIR,
        buildDir: config.buildDir || DEFAULT_BUILD_DIR,
        indexHtml: config.wwwIndexHtml || DEFAULT_INDEX_HTML
      };
    }

    if (config.generateDistribution === true) {
      outputTargets['distribution'] = {
        emptyDir: !(config.emptyDist === false),
        dir: config.distDir || DEFAULT_DIST_DIR,
        collectionDir: config.collectionDir || DEFAULT_COLLECTION_DIR
      };
    }

    const warningMsg =
`As of v0.7.0 "config.generateWWW, config.wwwDir" has been deprecated in favor of a configuration
that supports multiple output targets. The new format is as follows:

outputTargets: {
  "www": {
    dir: "www",
    emptyDir: true
  },
  "distribution": {
    dir: "dist",
    emptyDir: true
  }
}
`;
    config.logger.warn(warningMsg);
  }

  delete config.generateWWW;
  delete config.emptyWWW;
  delete config.wwwDir;
  delete config.buildDir;
  delete config.wwwIndexHtml;
  delete config.generateDistribution;
  delete config.emptyDist;
  delete config.distDir;
  delete config.collectionDir;

  config.outputTargets = outputTargets;
}
