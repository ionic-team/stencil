import * as d from '../../declarations';
import { HOST_CONFIG_FILENAME } from '../prerender/host-config';


export function validateServiceWorker(config: d.Config, outputTarget: d.OutputTargetWww) {
  if (config.devMode && !config.flags.serviceWorker) {
    outputTarget.serviceWorker = null;
    return;
  }

  if (outputTarget.serviceWorker === false || outputTarget.serviceWorker === null) {
    outputTarget.serviceWorker = null;
    return;
  }

  if (outputTarget.serviceWorker === true) {
    outputTarget.serviceWorker = {};

  } else if (!outputTarget.serviceWorker && config.devMode) {
    outputTarget.serviceWorker = null;
    return;
  }

  if (typeof outputTarget.serviceWorker !== 'object') {
    // what was passed in could have been a boolean
    // in that case let's just turn it into an empty obj so Object.assign doesn't crash
    outputTarget.serviceWorker = {};
  }

  if (!Array.isArray(outputTarget.serviceWorker.globPatterns)) {
    if (typeof outputTarget.serviceWorker.globPatterns === 'string') {
      outputTarget.serviceWorker.globPatterns = [outputTarget.serviceWorker.globPatterns];

    } else if (typeof outputTarget.serviceWorker.globPatterns !== 'string') {
      outputTarget.serviceWorker.globPatterns = DEFAULT_GLOB_PATTERNS.slice();
    }
  }

  if (typeof outputTarget.serviceWorker.globDirectory !== 'string') {
    outputTarget.serviceWorker.globDirectory = outputTarget.appDir;
  }

  if (typeof outputTarget.serviceWorker.globIgnores === 'string') {
    outputTarget.serviceWorker.globIgnores = [outputTarget.serviceWorker.globIgnores];
  }

  outputTarget.serviceWorker.globIgnores = outputTarget.serviceWorker.globIgnores || [];

  addGlobIgnores(config, outputTarget.serviceWorker.globIgnores);

  outputTarget.serviceWorker.dontCacheBustURLsMatching = /p-\w{8}/;

  if (!outputTarget.serviceWorker.swDest) {
    outputTarget.serviceWorker.swDest = config.sys.path.join(outputTarget.appDir, DEFAULT_FILENAME);
  }

  if (!config.sys.path.isAbsolute(outputTarget.serviceWorker.swDest)) {
    outputTarget.serviceWorker.swDest = config.sys.path.join(outputTarget.appDir, outputTarget.serviceWorker.swDest);
  }
}


function addGlobIgnores(config: d.Config, globIgnores: string[]) {
  globIgnores.push(
    `**/${HOST_CONFIG_FILENAME}`,
    `**/*.system.entry.js`,
    `**/*.system.js`,
    `**/${config.fsNamespace}.js`,
    `**/${config.fsNamespace}.esm.js`,
    `**/${config.fsNamespace}.css`,
  );
}


const DEFAULT_GLOB_PATTERNS = [
  '*.html',
  '**/*.{js,css,json}',
];

const DEFAULT_FILENAME = 'sw.js';
