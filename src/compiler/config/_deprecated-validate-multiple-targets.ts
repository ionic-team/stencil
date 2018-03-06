import { Config } from '../../declarations';
import {
  DEFAULT_BUILD_DIR,
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
    const warningMsg =
`As of v0.7.0 "config.generateWWW, config.wwwDir" has been deprecated in favor of a configuration
that supports multiple output targets. The new format can be found here: https://stenciljs.com/docs/config
`;
    if (config.logger) {
      config.logger.warn(warningMsg);
    }
  }

  if (outputTargets && outputTargets['www']) {
    outputTargets['www'] = {
      emptyDir: true,
      dir: DEFAULT_WWW_DIR,
      buildDir: DEFAULT_BUILD_DIR,
      indexHtml: DEFAULT_INDEX_HTML,
      ...outputTargets['www']
    };
  } else if (!outputTargets && config.generateWWW !== false) {
    outputTargets = {};
    outputTargets['www'] = {
      emptyDir: !(config.emptyWWW === false),
      dir: config.wwwDir || DEFAULT_WWW_DIR,
      buildDir: config.buildDir || DEFAULT_BUILD_DIR,
      indexHtml: config.wwwIndexHtml || DEFAULT_INDEX_HTML
    };
  } else {
    outputTargets = outputTargets || {};
  }

  if (outputTargets && outputTargets['distribution']) {
    outputTargets['distribution'] = {
      emptyDir: true,
      dir: DEFAULT_DIST_DIR,
      ...outputTargets['distribution']
    };
  } else if (config.generateDistribution === true) {
    outputTargets['distribution'] = {
      emptyDir: !(config.emptyDist === false),
      dir: config.distDir || DEFAULT_DIST_DIR,
    };
  }

  delete config.generateWWW;
  delete config.emptyWWW;
  delete config.wwwDir;
  delete config.buildDir;
  delete config.wwwIndexHtml;
  delete config.generateDistribution;
  delete config.emptyDist;
  delete config.distDir;

  config.outputTargets = outputTargets;
}
