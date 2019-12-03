import * as d from '../../declarations';
import { cloneDocument, createDocument, serializeNodeToHtml } from '@mock-doc';
import { createLogger } from './logger';
import { createStencilSys } from './stencil-sys';
import { resolveModuleIdSync, resolvePackageJsonSync } from './resolve/resolve-module';
import { scopeCss } from '../../utils/shadow-css';
import path from 'path';
import { compilerBuild } from '../../version';


export const getConfig = (userConfig: d.Config) => {
  const config = Object.assign(userConfig, {});

  if (!config.logger) {
    config.logger = createLogger();
  }

  if (!config.sys_next) {
    config.sys_next = createStencilSys();
  }

  config.flags = config.flags || {};
  if (config.flags.debug || config.flags.verbose) {
    config.logLevel = 'debug';
  } else if (config.flags.logLevel) {
    config.logLevel = config.flags.logLevel;
  } else if (typeof config.logLevel !== 'string') {
    config.logLevel = 'info';
  }
  config.logger.level = config.logLevel;


  return config;
};

export const patchSysLegacy = (config: d.Config, compilerCtx: d.CompilerCtx) => {
  // old way
  config.sys = config.sys || {};
  config.sys.path = path;
  config.sys.compiler = {
    name: '',
    version: compilerBuild.stencilVersion,
    typescriptVersion: compilerBuild.typescriptVersion,
    packageDir: path.resolve(__dirname, '..')
  },
  config.sys.generateContentHash = config.sys_next.generateContentHash;
  config.sys.scopeCss = (cssText, scopeId, commentOriginalSelector) => Promise.resolve(scopeCss(cssText, scopeId, commentOriginalSelector));
  config.sys.cloneDocument = cloneDocument;
  config.sys.createDocument = createDocument;
  config.sys.serializeNodeToHtml = serializeNodeToHtml;
  config.sys.optimizeCss = (inputOpts) => compilerCtx.worker.optimizeCss(inputOpts);
  config.sys.resolveModule = (fromDir, moduleId, opts = {}) => {
    if (opts.packageJson === true) {
      return resolvePackageJsonSync(config, compilerCtx.fs, moduleId, fromDir);
    } else {
      return resolveModuleIdSync(config, compilerCtx.fs, moduleId, fromDir, ['.js', '.mjs', '.css']);
    }
  };
  config.sys.encodeToBase64 = config.sys_next.encodeToBase64;
};
