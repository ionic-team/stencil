import { Config, StencilSystem } from '../util/interfaces';
import * as util from '../util/load-config';


export function loadConfig(configObj: string | Config) {
  const path = require('path');
  const nodeSys = require(path.join(__dirname, '../sys/node/index.js'));
  const sys: StencilSystem = new nodeSys.NodeSystem();

  const config = util.loadConfig(sys, configObj);
  config.logger = new nodeSys.NodeLogger();
  return config;
}
