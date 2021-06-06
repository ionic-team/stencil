import type * as d from '../../declarations';
import { applyPolyfills } from './polyfills';
import { initDevClient } from './init-dev-client';

declare const iframeWindow: Window;
declare const appWindow: d.DevClientWindow;
declare const config: d.DevClientConfig;

const defaultConfig: d.DevClientConfig = {
  basePath: appWindow.location.pathname,
  editors: [],
  reloadStrategy: 'hmr',
  socketUrl: `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.hostname}${
    location.port !== '' ? ':' + location.port : ''
  }/`,
};

applyPolyfills(iframeWindow);

initDevClient(appWindow, Object.assign({}, defaultConfig, appWindow.devServerConfig, config));
