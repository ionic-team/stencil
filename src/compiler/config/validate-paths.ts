import { Config } from '../../declarations/config';
import { normalizePath } from '../util';


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
  if (typeof config.srcDir !== 'string') {
    config.srcDir = DEFAULT_SRC_DIR;
  }
  if (!path.isAbsolute(config.srcDir)) {
    config.srcDir = normalizePath(path.join(config.rootDir, config.srcDir));
  }

  if (typeof config.wwwDir !== 'string') {
    config.wwwDir = DEFAULT_WWW_DIR;
  }
  if (!path.isAbsolute(config.wwwDir)) {
    config.wwwDir = normalizePath(path.join(config.rootDir, config.wwwDir));
  }

  if (typeof config.buildDir !== 'string') {
    config.buildDir = DEFAULT_BUILD_DIR;
  }
  if (!path.isAbsolute(config.buildDir)) {
    config.buildDir = normalizePath(path.join(config.wwwDir, config.buildDir));
  }

  if (typeof config.distDir !== 'string') {
    config.distDir = DEFAULT_DIST_DIR;
  }
  if (!path.isAbsolute(config.distDir)) {
    config.distDir = normalizePath(path.join(config.rootDir, config.distDir));
  }

  if (typeof config.collectionDir !== 'string') {
    config.collectionDir = DEFAULT_COLLECTION_DIR;
  }
  if (!path.isAbsolute(config.collectionDir)) {
    config.collectionDir = normalizePath(path.join(config.distDir, config.collectionDir));
  }

  if (typeof config.typesDir !== 'string') {
    config.typesDir = DEFAULT_TYPES_DIR;
  }
  if (!path.isAbsolute(config.typesDir)) {
    config.typesDir = normalizePath(path.join(config.distDir, config.typesDir));
  }

  if (typeof config.srcIndexHtml !== 'string') {
    config.srcIndexHtml = normalizePath(path.join(config.srcDir, DEFAULT_INDEX_HTML));
  }
  if (!path.isAbsolute(config.srcIndexHtml)) {
    config.srcIndexHtml = normalizePath(path.join(config.rootDir, config.srcIndexHtml));
  }

  if (typeof config.wwwIndexHtml !== 'string') {
    config.wwwIndexHtml = normalizePath(path.join(config.wwwDir, DEFAULT_INDEX_HTML));
  }
  if (!path.isAbsolute(config.wwwIndexHtml)) {
    config.wwwIndexHtml = normalizePath(path.join(config.wwwDir, config.wwwIndexHtml));
  }

  if (typeof config.publicPath !== 'string') {
    // CLIENT SIDE ONLY! Do not use this for server-side file read/writes
    // this is a reference to the public static directory from the index.html running from a browser
    // in most cases it's just "build", as in index page would request scripts from `/build/`
    config.publicPath = normalizePath(
      path.relative(config.wwwDir, config.buildDir)
    );
    if (config.publicPath.charAt(0) !== '/') {
      // ensure prefix / by default
      config.publicPath = '/' + config.publicPath;
    }
  }
  if (config.publicPath.charAt(config.publicPath.length - 1) !== '/') {
    // ensure there's a trailing /
    config.publicPath += '/';
  }

}


const DEFAULT_SRC_DIR = 'src';
const DEFAULT_WWW_DIR = 'www';
const DEFAULT_BUILD_DIR = 'build';
const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_DIST_DIR = 'dist';
const DEFAULT_COLLECTION_DIR = 'collection';
const DEFAULT_TYPES_DIR = 'types';
