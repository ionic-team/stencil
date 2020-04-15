import * as d from '../../declarations';
import { applyPolyfills } from './polyfills';
import { initClient } from './init-client';

declare const iframeWindow: Window;
declare const appWindow: d.DevClientWindow;
declare const appDoc: Document;
declare const config: d.DevClientConfig;

const defaultConfig: d.DevClientConfig = {
  basePath: appWindow.location.pathname,
  editors: [],
  reloadStrategy: 'hmr',
  socketUrl: `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.hostname}${location.port !== '' ? ':' + location.port : ''}/`,
};

const devClientConfig = Object.assign({}, defaultConfig, appWindow.devServerConfig, config);

applyPolyfills(iframeWindow);
initClient(appWindow, appDoc, devClientConfig);
