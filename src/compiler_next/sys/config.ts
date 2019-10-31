import * as d from '../../declarations';
import { cloneDocument, createDocument } from '@mock-doc';
import { createLogger } from './logger';
import { createStencilSys } from './stencil-sys';
import { scopeCss } from '../../utils/shadow-css';
import path from 'path';


export const getConfig = (userConfig: d.Config) => {
  const config = Object.assign(userConfig, {});

  if (!config.logger) {
    config.logger = createLogger();
  }

  if (!config.sys_next) {
    config.sys_next = createStencilSys();
  }

  if (config.flags.debug || config.flags.verbose) {
    config.logLevel = 'debug';
  } else if (config.flags.logLevel) {
    config.logLevel = config.flags.logLevel;
  } else if (typeof config.logLevel !== 'string') {
    config.logLevel = 'info';
  }
  config.logger.level = config.logLevel;

  // old way
  config.sys = config.sys || {};
  config.sys.path = path;
  config.sys.generateContentHash = config.sys_next.generateContentHash;
  config.sys.scopeCss = (cssText, scopeId, commentOriginalSelector) => Promise.resolve(scopeCss(cssText, scopeId, commentOriginalSelector));
  config.sys.cloneDocument = cloneDocument;
  config.sys.createDocument = createDocument;

  return config;
};
