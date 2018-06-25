import * as d from '../../declarations';
import { pathJoin } from '../util';
import { setBooleanConfig, setNumberConfig, setStringConfig } from './config-utils';


export function validateDevServer(config: d.Config) {
  config.devServer = config.devServer || {};

  setStringConfig(config.devServer, 'address', '0.0.0.0');
  setNumberConfig(config.devServer, 'port', null, 3333);
  setBooleanConfig(config.devServer, 'gzip', null, true);
  setBooleanConfig(config.devServer, 'hotReplacement', null, true);
  setBooleanConfig(config.devServer, 'openBrowser', null, true);

  validateProtocol(config.devServer);

  if (config.devServer.historyApiFallback !== null && config.devServer.historyApiFallback !== false) {
    config.devServer.historyApiFallback = config.devServer.historyApiFallback || {};

    if (typeof config.devServer.historyApiFallback.index !== 'string') {
      config.devServer.historyApiFallback.index = 'index.html';
    }

    if (typeof config.devServer.historyApiFallback.disableDotRule !== 'boolean') {
      config.devServer.historyApiFallback.disableDotRule = false;
    }
  }

  if (config.flags) {
    if (config.flags.open === false) {
      config.devServer.openBrowser = false;
    }

    if (config.flags.serve) {
      let wwwDir: string = null;
      const wwwOutputTarget: d.OutputTargetWww = config.outputTargets.find(o => o.type === 'www');

      if (wwwOutputTarget) {
        wwwDir = wwwOutputTarget.dir;
        config.logger.debug(`dev server www root: ${wwwDir}`);

      } else {
        wwwDir = config.rootDir;
        config.logger.debug(`dev server missing www output target, serving root directory: ${wwwDir}`);
      }

      setStringConfig(config.devServer, 'root', wwwDir);

      if (!config.sys.path.isAbsolute(config.devServer.root)) {
        config.devServer.root = pathJoin(config, config.rootDir, config.devServer.root);
      }
    }
  }

  return config.devServer;
}

function validateProtocol(devServer: d.DevServerConfig) {
  if (typeof devServer.protocol === 'string') {
    let protocol: string = devServer.protocol.trim().toLowerCase() as any;
    protocol = protocol.replace(':', '').replace('/', '');
    devServer.protocol = protocol as any;
  }
  if (devServer.protocol !== 'http' && devServer.protocol !== 'https') {
    devServer.protocol = 'http';
  }
}
