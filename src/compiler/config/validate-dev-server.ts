import * as d from '../../declarations';
import { buildError, isBoolean, isNumber, isString, normalizePath } from '@utils';
import { isAbsolute, join } from 'path';
import { isOutputTargetWww } from '../output-targets/output-utils';

export const validateDevServer = (config: d.Config, diagnostics: d.Diagnostic[]) => {
  if (config.devServer === false || config.devServer === null) {
    return null;
  }

  const flags = config.flags;
  const devServer = { ...config.devServer };

  if (isString(flags.address)) {
    devServer.address = flags.address;
  } else if (!isString(devServer.address)) {
    devServer.address = '0.0.0.0';
  }

  let addressProtocol: 'http' | 'https';
  if (devServer.address.toLowerCase().startsWith('http://')) {
    devServer.address = devServer.address.substring(7);
    addressProtocol = 'http';
  } else if (devServer.address.toLowerCase().startsWith('https://')) {
    devServer.address = devServer.address.substring(8);
    addressProtocol = 'https';
  }

  devServer.address = devServer.address.split('/')[0];

  let addressPort: number;
  const addressSplit = devServer.address.split(':');
  if (addressSplit.length > 1) {
    if (!isNaN(addressSplit[1] as any)) {
      devServer.address = addressSplit[0];
      addressPort = parseInt(addressSplit[1], 10);
    }
  }

  if (isNumber(flags.port)) {
    devServer.port = flags.port;
  } else if (devServer.port !== null && !isNumber(devServer.port)) {
    if (isNumber(addressPort)) {
      devServer.port = addressPort;
    } else if (devServer.address === 'localhost' || !isNaN(devServer.address.split('.')[0] as any)) {
      devServer.port = 3333;
    } else {
      devServer.port = null;
    }
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

  if (!isBoolean(devServer.gzip)) {
    devServer.gzip = true;
  }

  if (!isBoolean(devServer.openBrowser)) {
    devServer.openBrowser = true;
  }

  if (!isBoolean(devServer.websocket)) {
    devServer.websocket = true;
  }

  if (devServer.protocol !== 'http' && devServer.protocol !== 'https') {
    devServer.protocol = devServer.https ? 'https' : addressProtocol ? addressProtocol : 'http';
  }

  if (devServer.historyApiFallback !== null && devServer.historyApiFallback !== false) {
    devServer.historyApiFallback = devServer.historyApiFallback || {};

    if (!isString(devServer.historyApiFallback.index)) {
      devServer.historyApiFallback.index = 'index.html';
    }

    if (!isBoolean(devServer.historyApiFallback.disableDotRule)) {
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

  if (!isString(basePath) || basePath.trim() === '') {
    basePath = `/`;
  }

  basePath = normalizePath(basePath);

  if (!basePath.startsWith('/')) {
    basePath = '/' + basePath;
  }

  if (!basePath.endsWith('/')) {
    basePath += '/';
  }

  if (!isBoolean(devServer.logRequests)) {
    devServer.logRequests = config.logLevel === 'debug';
  }

  if (!isString(devServer.root)) {
    devServer.root = serveDir;
  }

  if (!isString(devServer.basePath)) {
    devServer.basePath = basePath;
  }

  if (isString((devServer as any).baseUrl)) {
    const err = buildError(diagnostics);
    err.messageText = `devServer config "baseUrl" has been renamed to "basePath", and should not include a domain or protocol.`;
  }

  if (!isAbsolute(devServer.root)) {
    devServer.root = join(config.rootDir, devServer.root);
  }
  devServer.root = normalizePath(devServer.root);

  if (devServer.excludeHmr) {
    if (!Array.isArray(devServer.excludeHmr)) {
      const err = buildError(diagnostics);
      err.messageText = `dev server excludeHmr must be an array of glob strings`;
    }
  } else {
    devServer.excludeHmr = [];
  }

  if (!config.devMode || config.buildEs5) {
    devServer.experimentalDevModules = false;
  } else {
    devServer.experimentalDevModules = !!devServer.experimentalDevModules;
  }

  return devServer;
};
