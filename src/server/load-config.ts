import { Config, StencilSystem } from '../declarations';
import { loadConfig as utilLoadConfig } from '../compiler/config/load-config';


export function loadConfig(configObj: string | Config) {
  const path = require('path');
  const nodeSys = require(path.join(__dirname, '../sys/node/index.js'));
  const sys: StencilSystem = new nodeSys.NodeSystem();

  const config = utilLoadConfig(sys, configObj);
  config.logger = new nodeSys.NodeLogger();
  return config;
}
