import * as d from '../../declarations';
import { buildError, normalizePath } from '@utils';
import { isOutputTargetWww } from '../../compiler/output-targets/output-utils';
import { URL } from 'url';
import path from 'path';


export function validateDevServer(config: d.Config, flags: d.ConfigFlags, diagnostics: d.Diagnostic[]) {
  if (config.devServer === false || config.devServer === null) {
    return null;
  }

  const devServer = Object.assign({}, config.devServer);

  if (typeof flags.address === 'string') {
    devServer.address = flags.address;
  } else if (typeof devServer.address !== 'string') {
    devServer.address = '0.0.0.0';
  }

  if (typeof flags.port === 'number') {
    devServer.port = flags.port;
  } else if (typeof devServer !== 'number') {
    devServer.port = 3333;
  }

  if ((devServer as any).hotReplacement === true) {
    // DEPRECATED: 2019-05-20
    devServer.reloadStrategy = 'hmr';
  } else if ((devServer as any).hotReplacement === false || (devServer as any).hotReplacement === null) {
    // DEPRECATED: 2019-05-20
    devServer.reloadStrategy = null;
  } else {
    if (devServer.reloadStrategy === undefined) {
      devServer.reloadStrategy = 'hmr';
    } else if (devServer.reloadStrategy !== 'hmr' && devServer.reloadStrategy !== 'pageReload' && devServer.reloadStrategy !== null) {
      throw new Error(`Invalid devServer reloadStrategy "${devServer.reloadStrategy}". Valid configs include "hmr", "pageReload" and null.`);
    }
  }

  if (typeof devServer.gzip !== 'boolean') {
    devServer.gzip = true;
  }

  if (typeof devServer.openBrowser !== 'boolean') {
    devServer.openBrowser = true;
  }

  if (typeof devServer.websocket !== 'boolean') {
    devServer.websocket = true;
  }

  if (devServer.protocol !== 'http' && devServer.protocol !== 'https') {
    devServer.protocol = devServer.https ? 'https' : 'http';
  }

  if (devServer.historyApiFallback !== null && devServer.historyApiFallback !== false) {
    devServer.historyApiFallback = devServer.historyApiFallback || {};

    if (typeof devServer.historyApiFallback.index !== 'string') {
      devServer.historyApiFallback.index = 'index.html';
    }

    if (typeof devServer.historyApiFallback.disableDotRule !== 'boolean') {
      devServer.historyApiFallback.disableDotRule = false;
    }
  }

  if (flags.open === false) {
    devServer.openBrowser = false;

  } else if (flags.prerender && !config.watch) {
    devServer.openBrowser = false;
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

  if (typeof devServer.logRequests !== 'boolean') {
    devServer.logRequests = (config.logLevel === 'debug');
  }

  if (typeof devServer.root !== 'string') {
    devServer.root = serveDir;
  }

  if (typeof devServer.basePath !== 'string') {
    devServer.basePath = basePath;
  }

  if (typeof (devServer as any).baseUrl === 'string') {
    const err = buildError(diagnostics);
    err.messageText = `devServer config "baseUrl" has been renamed to "basePath", and should not include a domain or protocol.`;
  }

  if (!path.isAbsolute(devServer.root)) {
    devServer.root = path.join(config.rootDir, devServer.root);
  }

  if (devServer.excludeHmr) {
    if (!Array.isArray(devServer.excludeHmr)) {
      const err = buildError(diagnostics);
      err.messageText = `dev server excludeHmr must be an array of glob strings`;
    }

  } else {
    devServer.excludeHmr = [];
  }

  return devServer;
}
