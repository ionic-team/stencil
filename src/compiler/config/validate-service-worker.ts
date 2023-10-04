import { isString } from '@utils';
import { isAbsolute, join } from 'path';

import type * as d from '../../declarations';

/**
 * Validate that a service worker configuration is valid, if it is present and
 * accounted for.
 *
 * Note that our service worker configuration / support is based on
 * Workbox, a package for automatically generating Service Workers to cache
 * assets on the client. More here: https://developer.chrome.com/docs/workbox/
 *
 * This function first checks that the service worker config set on the
 * supplied `OutputTarget` is not empty and that we are not currently in
 * development mode. In those cases it will early return.
 *
 * If we do find a service worker configuration we do some validation to ensure
 * that things are set up correctly.
 *
 * @param config the current, validated configuration
 * @param outputTarget the `www` outputTarget whose service worker
 * configuration we want to validate. **Note**: the `.serviceWorker` object
 * _will be mutated_ if it is present.
 * @param serviceWorker
 * @param appDir
 */
export const validateServiceWorker = (
  config: d.ValidatedConfig,
  serviceWorker: d.OutputTargetWww['serviceWorker'],
  appDir: string,
): false | null | d.ServiceWorkerConfig => {
  if (serviceWorker === false) {
    return false;
  }
  if (config.devMode && !config.flags.serviceWorker) {
    return null;
  }

  if (serviceWorker === null) {
    return null;
  }

  if (!serviceWorker && config.devMode) {
    return null;
  }

  const globDirectory = typeof serviceWorker?.globDirectory === 'string' ? serviceWorker.globDirectory : appDir;

  serviceWorker = {
    ...serviceWorker,
    globDirectory,
    swDest:
      serviceWorker?.swDest != null && isString(serviceWorker?.swDest)
        ? serviceWorker.swDest
        : join(appDir ?? '', DEFAULT_FILENAME),
  };

  if (!Array.isArray(serviceWorker.globPatterns)) {
    if (typeof serviceWorker.globPatterns === 'string') {
      serviceWorker.globPatterns = [serviceWorker.globPatterns];
    } else if (typeof serviceWorker.globPatterns !== 'string') {
      serviceWorker.globPatterns = DEFAULT_GLOB_PATTERNS.slice();
    }
  }

  if (typeof serviceWorker.globIgnores === 'string') {
    serviceWorker.globIgnores = [serviceWorker.globIgnores];
  }

  serviceWorker.globIgnores = serviceWorker.globIgnores || [];

  addGlobIgnores(config, serviceWorker.globIgnores);

  serviceWorker.dontCacheBustURLsMatching = /p-\w{8}/;

  if (isString(serviceWorker.swSrc) && !isAbsolute(serviceWorker.swSrc)) {
    serviceWorker.swSrc = join(config.rootDir, serviceWorker.swSrc);
  }

  if (isString(serviceWorker.swDest) && !isAbsolute(serviceWorker.swDest)) {
    serviceWorker.swDest = join(appDir ?? '', serviceWorker.swDest);
  }

  return serviceWorker;
};

/**
 * Add file glob patterns to the `globIgnores` for files we don't want to cache
 * with the service worker.
 *
 * @param config the current, validated configuration
 * @param globIgnores list of file ignore patterns. **Note**: will be mutated.
 */
const addGlobIgnores = (config: d.ValidatedConfig, globIgnores: string[]) => {
  globIgnores.push(
    `**/host.config.json`, // the filename of the host configuration
    `**/*.system.entry.js`,
    `**/*.system.js`,
    `**/${config.fsNamespace}.js`,
    `**/${config.fsNamespace}.esm.js`,
    `**/${config.fsNamespace}.css`,
  );
};

const DEFAULT_GLOB_PATTERNS = ['*.html', '**/*.{js,css,json}'];

const DEFAULT_FILENAME = 'sw.js';
