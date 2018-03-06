import { Config, ServiceWorkerConfig } from '../../util/interfaces';


export function validateServiceWorkerConfig(config: Config) {
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

  if (typeof swConfig.globDirectory !== 'string') {
    swConfig.globDirectory = config.outputTargets['www'].dir;
  }

  if (!swConfig.swDest) {
    swConfig.swDest = config.sys.path.join(config.outputTargets['www'].dir, DEFAULT_SW_FILENAME);
  }
  if (!config.sys.path.isAbsolute(swConfig.swDest)) {
    swConfig.swDest = config.sys.path.join(config.outputTargets['www'].dir, swConfig.swDest);
  }

  config.serviceWorker = swConfig;
}


const DEFAULT_SW_CONFIG: ServiceWorkerConfig = {
  globPatterns: [
    '**/*.{js,css,json,html,ico,png,svg}'
  ]
};

const DEFAULT_SW_FILENAME = 'sw.js';
