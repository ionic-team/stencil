import { Config } from '../../declarations';
import { normalizePath } from '../util';
import { setStringConfig } from './config-utils';


export function validatePaths(config: Config) {
  const path = config.sys.path;

  if (typeof (config as any).global === 'string') {
    // deprecated: 2017-12-12
    config.logger.warn(`stencil config property "global" has been renamed to "globalScript"`);
    config.globalScript = (config as any).global;
  }

  if (typeof config.globalScript === 'string' && !path.isAbsolute(config.globalScript)) {
    config.globalScript = normalizePath(path.join(config.rootDir, config.globalScript));
  }

  if (typeof config.globalStyle === 'string') {
    config.globalStyle = [config.globalStyle];
  }
  if (Array.isArray(config.globalStyle)) {
    config.globalStyle = config.globalStyle.filter(globalStyle => typeof globalStyle === 'string');
    config.globalStyle = config.globalStyle.map(globalStyle => {
      if (path.isAbsolute(globalStyle)) {
        return normalizePath(globalStyle);
      }
      return normalizePath(path.join(config.rootDir, globalStyle));
    });
  }

  if (typeof (config as any).src === 'string') {
    // deprecated: 2017-08-14
    config.logger.warn(`stencil config property "src" has been renamed to "srcDir"`);
    config.srcDir = (config as any).src;
  }

  setStringConfig(config, 'srcDir', DEFAULT_SRC_DIR);
  if (!path.isAbsolute(config.srcDir)) {
    config.srcDir = normalizePath(path.join(config.rootDir, config.srcDir));
  }

  if (config.outputTargets['www'] && !path.isAbsolute(config.outputTargets['www'].dir)) {
    config.outputTargets['www'].dir =
      normalizePath(path.join(config.rootDir, config.outputTargets['www'].dir));
  }

  if (config.outputTargets['www'] && !path.isAbsolute(config.outputTargets['www'].indexHtml)) {
    config.outputTargets['www'].indexHtml =
      normalizePath(path.join(config.outputTargets['www'].dir, config.outputTargets['www'].indexHtml));
  }

  if (config.outputTargets['www'] && !path.isAbsolute(config.outputTargets['www'].buildDir)) {
    config.outputTargets['www'].buildDir =
      normalizePath(path.join(config.outputTargets['www'].dir, config.outputTargets['www'].buildDir));
  }

  if (config.outputTargets['distribution'] && !path.isAbsolute(config.outputTargets['distribution'].dir)) {
    config.outputTargets['distribution'].dir =
      normalizePath(path.join(config.rootDir, config.outputTargets['distribution'].dir));
  }

  if (config.outputTargets['distribution'] && !path.isAbsolute(config.outputTargets['distribution'].collectionDir)) {
    config.outputTargets['distribution'].collectionDir =
      normalizePath(path.join(config.outputTargets['distribution'].dir, config.outputTargets['distribution'].collectionDir));
  }

  setStringConfig(config, 'tsconfig', DEFAULT_TSCONFIG);
  if (!path.isAbsolute(config.tsconfig)) {
    config.tsconfig = normalizePath(path.join(config.rootDir, config.tsconfig));
  }

  setStringConfig(config, 'typesDir', DEFAULT_TYPES_DIR);
  if (config.outputTargets['distribution'] && !path.isAbsolute(config.typesDir)) {
    config.typesDir = normalizePath(path.join(config.outputTargets['distribution'].dir, config.typesDir));
  }

  setStringConfig(config, 'srcIndexHtml', normalizePath(path.join(config.srcDir, DEFAULT_INDEX_HTML)));
  if (!path.isAbsolute(config.srcIndexHtml)) {
    config.srcIndexHtml = normalizePath(path.join(config.rootDir, config.srcIndexHtml));
  }


  if (config.writeLog) {
    setStringConfig(config, 'buildLogFilePath', DEFAULT_BUILD_LOG_FILE_NAME);
    if (!path.isAbsolute(config.buildLogFilePath)) {
      config.buildLogFilePath = normalizePath(path.join(config.rootDir, config.buildLogFilePath));
    }
    config.logger.buildLogFilePath = config.buildLogFilePath;
  }

  if (config.writeStats) {
    setStringConfig(config, 'buildStatsFilePath', DEFAULT_STATS_JSON_FILE_NAME);
    if (!path.isAbsolute(config.buildStatsFilePath)) {
      config.buildStatsFilePath = normalizePath(path.join(config.rootDir, config.buildStatsFilePath));
    }
  }
}

export const DEFAULT_DIST_DIR = 'dist';
export const DEFAULT_WWW_DIR = 'www';
export const DEFAULT_INDEX_HTML = 'index.html';
export const DEFAULT_COLLECTION_DIR = 'collection';
export const DEFAULT_BUILD_DIR = 'build';
const DEFAULT_SRC_DIR = 'src';
const DEFAULT_TYPES_DIR = 'types';
const DEFAULT_TSCONFIG = 'tsconfig.json';
const DEFAULT_BUILD_LOG_FILE_NAME = 'stencil-build.log';
const DEFAULT_STATS_JSON_FILE_NAME = 'stencil-stats.json';
