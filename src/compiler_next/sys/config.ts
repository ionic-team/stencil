import * as d from '../../declarations';
import { serializeNodeToHtml } from '@stencil/core/mock-doc';
import { createLogger } from './logger';
import { createSystem } from './stencil-sys';
import { resolveModuleIdSync, resolvePackageJsonSync } from './resolve/resolve-module-sync';
import { scopeCss } from '../../utils/shadow-css';


export const getConfig = (userConfig: d.Config) => {
  const config = { ...userConfig };

  if (!config.logger) {
    config.logger = createLogger();
  }

  if (!config.sys_next) {
    config.sys_next = createSystem();
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
  config.sys.scopeCss = (cssText, scopeId, commentOriginalSelector) => Promise.resolve(scopeCss(cssText, scopeId, commentOriginalSelector));
  config.sys.serializeNodeToHtml = serializeNodeToHtml;
  config.sys.optimizeCss = (inputOpts) => compilerCtx.worker.optimizeCss(inputOpts);
  config.sys.resolveModule = (fromDir, moduleId, opts = {}) => {
    if (opts.packageJson === true) {
      return resolvePackageJsonSync(config, compilerCtx.fs, moduleId, fromDir);
    } else {
      return resolveModuleIdSync(config, compilerCtx.fs, moduleId, fromDir, ['.js', '.mjs', '.css']);
    }
  };
};
