import * as d from '../../declarations';
import { applyPolyfills } from './polyfills';
import { initClient } from './init-client';

declare const iframeWindow: Window;
declare const appWindow: d.DevClientWindow;
declare const appDoc: Document;
declare const config: d.DevClientConfig;

applyPolyfills(iframeWindow);

initClient(appWindow, appDoc, config || {} as any);
