import * as d from '../../declarations';


export function validateServiceWorker(config: d.Config, outputTarget: d.OutputTargetWww) {
  if (config.devMode) {
    outputTarget.serviceWorker = null;
    return;
  }

  if (outputTarget.serviceWorker === false || outputTarget.serviceWorker === null) {
    outputTarget.serviceWorker = null;
    return;
  }

  if (!outputTarget.serviceWorker && outputTarget.type !== 'www') {
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
      outputTarget.serviceWorker.globPatterns = [DEFAULT_GLOB_PATTERNS];
    }
  }

  if (typeof outputTarget.serviceWorker.globDirectory !== 'string') {
    outputTarget.serviceWorker.globDirectory = outputTarget.dir;
  }

  if (!outputTarget.serviceWorker.swDest) {
    outputTarget.serviceWorker.swDest = config.sys.path.join(outputTarget.dir, DEFAULT_FILENAME);
  }

  if (!config.sys.path.isAbsolute(outputTarget.serviceWorker.swDest)) {
    outputTarget.serviceWorker.swDest = config.sys.path.join(outputTarget.dir, outputTarget.serviceWorker.swDest);
  }
}


const DEFAULT_GLOB_PATTERNS = '**/*.{js,css,json,html,ico,png,svg}';
const DEFAULT_FILENAME = 'sw.js';
