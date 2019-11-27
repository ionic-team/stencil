import * as d from '../../declarations';
import { normalizePath } from '@utils';
import path from 'path';


export function validatePaths(config: d.Config) {
  if (typeof config.rootDir !== 'string') {
    config.rootDir = '/';
  }

  if (typeof config.srcDir !== 'string') {
    config.srcDir = DEFAULT_SRC_DIR;
  }
  if (!path.isAbsolute(config.srcDir)) {
    config.srcDir = path.join(config.rootDir, config.srcDir);
  }
  config.srcDir = normalizePath(config.srcDir);

  if (typeof config.cacheDir !== 'string') {
    config.cacheDir = DEFAULT_CACHE_DIR;
  }
  if (!path.isAbsolute(config.cacheDir)) {
    config.cacheDir = path.join(config.rootDir, config.cacheDir);
  }
  config.cacheDir = normalizePath(config.cacheDir);

  if (typeof config.srcIndexHtml !== 'string') {
    config.srcIndexHtml =  normalizePath(path.join(config.srcDir, DEFAULT_INDEX_HTML));
  }
  if (!path.isAbsolute(config.srcIndexHtml)) {
    config.srcIndexHtml = path.join(config.rootDir, config.srcIndexHtml);
  }
  config.srcIndexHtml = normalizePath(config.srcIndexHtml);

  if (typeof config.globalScript === 'string' && !path.isAbsolute(config.globalScript)) {
    if (!path.isAbsolute(config.globalScript)) {
      config.globalScript = path.join(config.rootDir, config.globalScript);
    }
    config.globalScript = normalizePath(config.globalScript);
  }

  if (typeof config.globalStyle === 'string') {
    if (!path.isAbsolute(config.globalStyle)) {
      config.globalStyle = path.join(config.rootDir, config.globalStyle);
    }
    config.globalStyle = normalizePath(config.globalStyle);
  }

  if (config.writeLog) {
    if (typeof config.buildLogFilePath !== 'string') {
      config.buildLogFilePath = DEFAULT_BUILD_LOG_FILE_NAME;
    }
    if (!path.isAbsolute(config.buildLogFilePath)) {
      config.buildLogFilePath = path.join(config.rootDir, config.buildLogFilePath);
    }
    config.buildLogFilePath = normalizePath(config.buildLogFilePath);
  }
}


const DEFAULT_BUILD_LOG_FILE_NAME = 'stencil-build.log';
const DEFAULT_CACHE_DIR = '.stencil';
const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_SRC_DIR = 'src';
