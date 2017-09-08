import { BuildConfig, ServiceWorkerConfig } from '../../util/interfaces';


export function validateServiceWorkerConfig(config: BuildConfig) {
  if (!config.serviceWorker) {
    config.serviceWorker = null;
    return;
  }

  if (typeof config.serviceWorker !== 'object') {
    // what was passed in could have been a boolean
    // in that case let's just turn it into an empty obj so Object.assign doesn't crash
    config.serviceWorker = {};
  }

  const swConfig: ServiceWorkerConfig = Object.assign({}, DEFAULT_SW_CONFIG, config.serviceWorker);

  if (!swConfig.globDirectory) {
    swConfig.globDirectory = config.wwwDir;
  }

  if (!swConfig.swDest) {
    swConfig.swDest = config.sys.path.join(config.wwwDir, DEFAULT_SW_FILENAME);
  }
  if (!config.sys.path.isAbsolute(swConfig.swDest)) {
    swConfig.swDest = config.sys.path.join(config.wwwDir, swConfig.swDest);
  }

  config.serviceWorker = swConfig;
}


const DEFAULT_SW_CONFIG: ServiceWorkerConfig = {
  skipWaiting: true,
  clientsClaim: true,
  globPatterns: [
    '**/*.{js,css,json,html,ico,png,svg}'
  ]
};

const DEFAULT_SW_FILENAME = 'sw.js';
