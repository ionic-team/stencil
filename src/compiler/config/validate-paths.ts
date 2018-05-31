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

  if (Array.isArray(config.globalStyle)) {
    // DEPRECATED 2018-05-31
    config.logger.warn(`"globalStyle" config no longer accepts an array. Please update to only use a single entry point for a global style css file.`);
    if (config.globalStyle.length > 0) {
      config.globalStyle = config.globalStyle[0];
    }
  }

  if (typeof config.globalStyle === 'string') {
    if (!path.isAbsolute(config.globalStyle)) {
      config.globalStyle = path.join(config.rootDir, config.globalStyle);
    }
    config.globalStyle = normalizePath(config.globalStyle);
  }

  setStringConfig(config, 'srcDir', DEFAULT_SRC_DIR);
  if (!path.isAbsolute(config.srcDir)) {
    config.srcDir = normalizePath(path.join(config.rootDir, config.srcDir));
  }

  setStringConfig(config, 'tsconfig', DEFAULT_TSCONFIG);
  if (!path.isAbsolute(config.tsconfig)) {
    config.tsconfig = normalizePath(path.join(config.rootDir, config.tsconfig));
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
}


const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_SRC_DIR = 'src';
const DEFAULT_TSCONFIG = 'tsconfig.json';
const DEFAULT_BUILD_LOG_FILE_NAME = 'stencil-build.log';
