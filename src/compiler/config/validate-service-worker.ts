import * as d from '@declarations';
import { HOST_CONFIG_FILENAME } from '../prerender/host-config';
import { sys } from '@sys';


export function validateServiceWorker(config: d.Config, serviceWorker: d.ServiceWorkerConfig, dir: string) {
  if (config.devMode && !config.flags.serviceWorker) {
    return null;
  }

  if (serviceWorker === false || serviceWorker === null) {
    return null;
  }

  if (serviceWorker === true) {
    serviceWorker = {};

  } else if (!serviceWorker && config.devMode) {
    return null;
  }

  if (typeof serviceWorker !== 'object') {
    // what was passed in could have been a boolean
    // in that case let's just turn it into an empty obj so Object.assign doesn't crash
    serviceWorker = {};
  }

  if (!Array.isArray(serviceWorker.globPatterns)) {
    if (typeof serviceWorker.globPatterns === 'string') {
      serviceWorker.globPatterns = [serviceWorker.globPatterns];

    } else if (typeof serviceWorker.globPatterns !== 'string') {
      serviceWorker.globPatterns = [DEFAULT_GLOB_PATTERNS];
    }
  }

  if (typeof serviceWorker.globDirectory !== 'string') {
    serviceWorker.globDirectory = dir;
  }

  if (typeof serviceWorker.globIgnores === 'string') {
    serviceWorker.globIgnores = [serviceWorker.globIgnores];
  }

  serviceWorker.globIgnores = serviceWorker.globIgnores || [];

  addGlobIgnores(serviceWorker.globIgnores);

  if (!serviceWorker.swDest) {
    serviceWorker.swDest = sys.path.join(dir, DEFAULT_FILENAME);
  }

  if (!sys.path.isAbsolute(serviceWorker.swDest)) {
    serviceWorker.swDest = sys.path.join(dir, serviceWorker.swDest);
  }
  return serviceWorker;
}


function addGlobIgnores(globIgnores: string[]) {
  const hostConfigJson = `**/${HOST_CONFIG_FILENAME}`;
  globIgnores.push(hostConfigJson);
}


const DEFAULT_GLOB_PATTERNS = '**/*.{js,css,json,html}';
const DEFAULT_FILENAME = 'sw.js';
