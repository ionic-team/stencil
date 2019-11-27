import * as d from '../../declarations';
import { buildError, normalizePath } from '@utils';
import { isOutputTargetWww } from '../output-targets/output-utils';
import { setBooleanConfig, setNumberConfig, setStringConfig } from './config-utils';
import { URL } from 'url';


export function validateDevServer(config: d.Config, diagnostics: d.Diagnostic[]) {
  if (config.devServer === false || config.devServer === null) {
    return config.devServer = null;
  }
  config.devServer = config.devServer || {};

  if (typeof config.flags.address === 'string') {
    config.devServer.address = config.flags.address;
  } else {
    setStringConfig(config.devServer, 'address', '0.0.0.0');
  }

  if (typeof config.flags.port === 'number') {
    config.devServer.port = config.flags.port;
  } else {
    setNumberConfig(config.devServer, 'port', null, 3333);
  }

  if ((config.devServer as any).hotReplacement === true) {
    // DEPRECATED: 2019-05-20
    config.devServer.reloadStrategy = 'hmr';
  } else if ((config.devServer as any).hotReplacement === false || (config.devServer as any).hotReplacement === null) {
    // DEPRECATED: 2019-05-20
    config.devServer.reloadStrategy = null;
  } else {
    if (config.devServer.reloadStrategy === undefined) {
      config.devServer.reloadStrategy = 'hmr';
    } else if (config.devServer.reloadStrategy !== 'hmr' && config.devServer.reloadStrategy !== 'pageReload' && config.devServer.reloadStrategy !== null) {
      throw new Error(`Invalid devServer reloadStrategy "${config.devServer.reloadStrategy}". Valid configs include "hmr", "pageReload" and null.`);
    }
  }

  setBooleanConfig(config.devServer, 'gzip', null, true);
  setBooleanConfig(config.devServer, 'openBrowser', null, true);
  setBooleanConfig(config.devServer, 'websocket', null, true);

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

  if (config.flags.open === false) {
    config.devServer.openBrowser = false;

  } else if (config.flags.prerender && !config.watch) {
    config.devServer.openBrowser = false;
  }

  let serveDir: string = null;
  let basePath: string = null;
  const wwwOutputTarget = config.outputTargets.find(isOutputTargetWww);

  if (wwwOutputTarget) {
    const baseUrl = new URL(wwwOutputTarget.baseUrl, 'http://config.stenciljs.com');
    basePath = baseUrl.pathname;
    serveDir = wwwOutputTarget.appDir;

  } else {
    serveDir = config.rootDir;
  }

  if (typeof basePath !== 'string' || basePath.trim() === '') {
    basePath = `/`;
  }

  basePath = normalizePath(basePath);

  if (!basePath.startsWith('/')) {
    basePath = '/' + basePath;
  }

  if (!basePath.endsWith('/')) {
    basePath += '/';
  }

  if (typeof config.devServer.logRequests !== 'boolean') {
    config.devServer.logRequests = (config.logLevel === 'debug');
  }

  setStringConfig(config.devServer, 'root', serveDir);
  setStringConfig(config.devServer, 'basePath', basePath);

  if (typeof (config.devServer as any).baseUrl === 'string') {
    const err = buildError(diagnostics);
    err.messageText = `devServer config "baseUrl" has been renamed to "basePath", and should not include a domain or protocol.`;
  }

  if (!config.sys.path.isAbsolute(config.devServer.root)) {
    config.devServer.root = config.sys.path.join(config.rootDir, config.devServer.root);
  }

  if (config.devServer.excludeHmr) {
    if (!Array.isArray(config.devServer.excludeHmr)) {
      const err = buildError(diagnostics);
      err.messageText = `dev server excludeHmr must be an array of glob strings`;
    }

  } else {
    config.devServer.excludeHmr = [];
  }

  return config.devServer;
}

function validateProtocol(devServer: d.DevServerConfig) {
  devServer.protocol = devServer.https ? 'https' : 'http';
}
