import * as d from '../../declarations';


export function validateCopy(config: d.Config) {
  if (config.copy === null || (config.copy as any) === false) {
    // manually forcing to skip the copy task
    config.copy = null;
    return;
  }

  if (!Array.isArray(config.copy)) {
    config.copy = [];
  }

  if (!config.copy.some(c => c.src === DEFAULT_ASSETS.src)) {
    config.copy.push(DEFAULT_ASSETS);
  }

  if (!config.copy.some(c => c.src === DEFAULT_MANIFEST.src)) {
    config.copy.push(DEFAULT_MANIFEST);
  }

}


const DEFAULT_ASSETS = { src: 'assets', warn: false };
const DEFAULT_MANIFEST = { src: 'manifest.json', warn: false };
