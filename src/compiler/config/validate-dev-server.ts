import { buildError, isBoolean, isNumber, isString, normalizePath } from '@utils';
import { isAbsolute, join } from 'path';

import type * as d from '../../declarations';
import { isOutputTargetWww } from '../output-targets/output-utils';

/**
 * Produce a new, fully-validated dev server configuration based on the dev
 * server configuration found on a Stencil config object. If no dev server
 * config is supplied, this will return `undefined` instead.
 *
 * @param validatedConfig a validated config to use
 * @param originalConfig the original config supplied by the user
 * @param diagnostics an out param for setting diagnostic information
 * @returns a new, validated dev server configuration
 */
export const validateDevServer = (
  validatedConfig: d.ValidatedConfig,
  originalConfig: d.UnvalidatedConfig,
  diagnostics: d.Diagnostic[]
): d.ValidatedDevServerConfig | undefined => {
  if ((validatedConfig.devServer === null || (validatedConfig.devServer as any)) === false) {
    return undefined;
  }

  const { flags } = validatedConfig;
  const { address, addressProtocol, addressPort } = getDevServerAddress(
    flags.address ?? validatedConfig.devServer?.address
  );

  // @ts-ignore
  const devServer: d.ValidatedDevServerConfig = {
    ...(validatedConfig.devServer ?? {}),
    address,
    root: validatedConfig.devServer?.root ?? validatedConfig.rootDir ?? '/',
  };

  if (isNumber(flags.port)) {
    devServer.port = flags.port;
  } else if (devServer.port !== null && !isNumber(devServer.port)) {
    if (isNumber(addressPort)) {
      devServer.port = addressPort;
    }
  }

  if (devServer.reloadStrategy === undefined) {
    devServer.reloadStrategy = 'hmr';
  } else if (
    devServer.reloadStrategy !== 'hmr' &&
    devServer.reloadStrategy !== 'pageReload' &&
    devServer.reloadStrategy !== null
  ) {
    const err = buildError(diagnostics);
    err.messageText = `Invalid devServer reloadStrategy "${devServer.reloadStrategy}". Valid configs include "hmr", "pageReload" and null.`;
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

  if (flags.ssr) {
    devServer.ssr = true;
  } else {
    devServer.ssr = !!devServer.ssr;
  }

  if (devServer.ssr) {
    const wwwOutput = (validatedConfig.outputTargets ?? []).find(isOutputTargetWww);
    devServer.prerenderConfig = wwwOutput?.prerenderConfig;
  }

  if (isString(validatedConfig.srcIndexHtml)) {
    devServer.srcIndexHtml = normalizePath(validatedConfig.srcIndexHtml);
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
  } else if (flags.prerender && !validatedConfig.watch) {
    devServer.openBrowser = false;
  }

  let serveDir: string;
  let basePath: string;
  const wwwOutputTarget = (validatedConfig.outputTargets ?? []).find(isOutputTargetWww);

  if (wwwOutputTarget) {
    const baseUrl = new URL(wwwOutputTarget.baseUrl ?? '', 'http://config.stenciljs.com');
    basePath = baseUrl.pathname;
    serveDir = wwwOutputTarget.appDir ?? '';
  } else {
    basePath = '';
    serveDir = validatedConfig.rootDir ?? '';
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
    devServer.logRequests = validatedConfig.logLevel === 'debug';
  }

  if (!isString(originalConfig.devServer?.root)) {
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
    devServer.root = join(validatedConfig.rootDir as string, devServer.root);
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

  if (!validatedConfig.devMode || validatedConfig.buildEs5) {
    devServer.experimentalDevModules = false;
  } else {
    devServer.experimentalDevModules = !!devServer.experimentalDevModules;
  }

  return devServer;
};

/**
 * Given an address string format an address, a port, and a protocol for the
 * dev server configuration.
 *
 * @param address the address to start with (defaults to "0.0.0.0")
 * @returns an object holding a formatted address, a suitable port number, and
 * the protocol to use ("http" | "https")
 */
function getDevServerAddress(address: string = '0.0.0.0') {
  // default to http for localdev
  let addressProtocol: 'http' | 'https' = 'http';
  if (address.toLowerCase().startsWith('http://')) {
    address = address.substring(7);
    addressProtocol = 'http';
  } else if (address.toLowerCase().startsWith('https://')) {
    address = address.substring(8);
    addressProtocol = 'https';
  }

  address = address.split('/')[0];

  // split on `:` to get the domain and the (possibly present) port
  // separately. we've already sliced off the protocol (if present) above
  // so we can safely split on `:` here.
  const addressSplit = address.split(':');

  const isLocalhost = addressSplit[0] === 'localhost' || !isNaN(addressSplit[0].split('.')[0] as any);

  // if localhost we use 3333 as a default port
  let addressPort: number | undefined = isLocalhost ? 3333 : undefined;

  if (addressSplit.length > 1) {
    if (!isNaN(addressSplit[1] as any)) {
      address = addressSplit[0];
      addressPort = parseInt(addressSplit[1], 10);
    }
  }

  return {
    address,
    addressProtocol,
    addressPort,
  };
}
