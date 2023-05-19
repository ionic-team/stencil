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
 * configuration we want to validate.
 * @returns `null` or `false` if a service worker is not used or a validated service worker object
 */
export const validateServiceWorker = (
  config: d.ValidatedConfig,
  outputTarget: d.OutputTargetWww
): d.ValidatedOutputTargetWww['serviceWorker'] => {
  if (outputTarget.serviceWorker === false) {
    return false;
  }
  if (config.devMode && !config.flags.serviceWorker) {
    return null;
  }
  if (outputTarget.serviceWorker === null) {
    return null;
  }
  if (!outputTarget.serviceWorker && config.devMode) {
    return null;
  }

  const globDirectory = isString(outputTarget.serviceWorker?.globDirectory)
    ? outputTarget.serviceWorker!.globDirectory
    : outputTarget.appDir;

  const serviceWorkerConfig: d.ServiceWorkerConfig = {
    ...outputTarget.serviceWorker,
    globDirectory,
    swDest: isString(outputTarget.serviceWorker?.swDest)
      ? outputTarget.serviceWorker!.swDest
      : join(outputTarget.appDir ?? '', DEFAULT_FILENAME),
  };

  if (!Array.isArray(serviceWorkerConfig.globPatterns)) {
    if (typeof serviceWorkerConfig.globPatterns === 'string') {
      serviceWorkerConfig.globPatterns = [serviceWorkerConfig.globPatterns];
    } else if (typeof serviceWorkerConfig.globPatterns !== 'string') {
      serviceWorkerConfig.globPatterns = DEFAULT_GLOB_PATTERNS.slice();
    }
  }

  if (typeof serviceWorkerConfig.globIgnores === 'string') {
    serviceWorkerConfig.globIgnores = [serviceWorkerConfig.globIgnores];
  }

  serviceWorkerConfig.globIgnores = serviceWorkerConfig.globIgnores || [];

  addGlobIgnores(config, serviceWorkerConfig.globIgnores);

  serviceWorkerConfig.dontCacheBustURLsMatching = /p-\w{8}/;

  if (isString(serviceWorkerConfig.swSrc) && !isAbsolute(serviceWorkerConfig.swSrc)) {
    serviceWorkerConfig.swSrc = join(config.rootDir, serviceWorkerConfig.swSrc);
  }

  if (isString(serviceWorkerConfig.swDest) && !isAbsolute(serviceWorkerConfig.swDest)) {
    serviceWorkerConfig.swDest = join(outputTarget.appDir ?? '', serviceWorkerConfig.swDest);
  }

  return serviceWorkerConfig;
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
    `**/${config.fsNamespace}.css`
  );
};

const DEFAULT_GLOB_PATTERNS = ['*.html', '**/*.{js,css,json}'];

const DEFAULT_FILENAME = 'sw.js';
