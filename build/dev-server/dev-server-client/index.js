import { initDevClient } from './init-dev-client';
// TODO(STENCIL-465): Investigate whether we can delete these polyfills
import { applyPolyfills } from './polyfills';
const defaultConfig = {
    basePath: appWindow.location.pathname,
    editors: [],
    reloadStrategy: 'hmr',
    socketUrl: `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.hostname}${location.port !== '' ? ':' + location.port : ''}/`,
};
// TODO(STENCIL-465): Investigate whether we can delete these polyfills
applyPolyfills(iframeWindow);
initDevClient(appWindow, Object.assign({}, defaultConfig, appWindow.devServerConfig, config));
//# sourceMappingURL=index.js.map