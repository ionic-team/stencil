import * as d from '../../declarations';
import { browserLogger } from './browser-logger';
import { browserSystem } from './browser-sys';
import { Compiler } from '../../compiler';
import fs from 'fs';


class BrowserCompiler extends Compiler {

  constructor(config: d.BrowserConfig) {
    if (config == null) {
      config = {};
    }
    if (config.win == null) {
      config.win = window;
    }

    config.enableCache = false;
    config.validateTypes = false;

    if (config.sys == null) {
      config.sys = browserSystem(config);
    }

    if (config.logger == null) {
      config.logger = browserLogger(config);
    }

    if (typeof (config as d.Config).rootDir !== 'string') {
      (config as d.Config).rootDir = '/';
    }

    super(config);
  }

}


export { BrowserCompiler as Compiler };
export { StencilConfig as Config } from '../../declarations';
export { fs };
