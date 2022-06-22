import type * as d from '../../declarations';
import { isAbsolute, join } from 'path';

export const validatePaths = (config: d.UnvalidatedConfig) => {
  if (typeof config.rootDir !== 'string') {
    config.rootDir = '/';
  }

  if (typeof config.srcDir !== 'string') {
    config.srcDir = DEFAULT_SRC_DIR;
  }
  if (!isAbsolute(config.srcDir)) {
    config.srcDir = join(config.rootDir, config.srcDir);
  }

  if (typeof config.cacheDir !== 'string') {
    config.cacheDir = DEFAULT_CACHE_DIR;
  }
  if (!isAbsolute(config.cacheDir)) {
    config.cacheDir = join(config.rootDir, config.cacheDir);
  }

  if (typeof config.srcIndexHtml !== 'string') {
    config.srcIndexHtml = join(config.srcDir, DEFAULT_INDEX_HTML);
  }
  if (!isAbsolute(config.srcIndexHtml)) {
    config.srcIndexHtml = join(config.rootDir, config.srcIndexHtml);
  }

  if (typeof config.globalScript === 'string' && !isAbsolute(config.globalScript)) {
    if (!isAbsolute(config.globalScript)) {
      config.globalScript = join(config.rootDir, config.globalScript);
    }
  }

  if (typeof config.globalStyle === 'string') {
    if (!isAbsolute(config.globalStyle)) {
      config.globalStyle = join(config.rootDir, config.globalStyle);
    }
  }

  if (config.writeLog) {
    if (typeof config.buildLogFilePath !== 'string') {
      config.buildLogFilePath = DEFAULT_BUILD_LOG_FILE_NAME;
    }
    if (!isAbsolute(config.buildLogFilePath)) {
      config.buildLogFilePath = join(config.rootDir, config.buildLogFilePath);
    }
  }

  config.packageJsonFilePath = join(config.rootDir, 'package.json');
};

const DEFAULT_BUILD_LOG_FILE_NAME = 'stencil-build.log';
const DEFAULT_CACHE_DIR = '.stencil';
const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_SRC_DIR = 'src';
