import * as d from '@declarations';
import { setBooleanConfig, setNumberConfig, setStringConfig } from './config-utils';
import { normalizePath } from '@utils';


export function validatePrerender(config: d.Config, outputTarget: d.OutputTargetWww) {
  if (!config.flags || !config.flags.prerender) {
    return;
  }

  setStringConfig(outputTarget, 'baseUrl', DEFAULT_BASE_URL);
  setNumberConfig(outputTarget, 'prerenderMaxConcurrent', null, DEFAULT_MAX_CONCURRENT);
  setBooleanConfig(outputTarget, 'removeUnusedStyles', null, DEFAULT_REMOVE_UNUSED_STYLES);

  if (config.devMode) {
    setBooleanConfig(outputTarget, 'collapseWhitespace', null, true);
  }

  outputTarget.baseUrl = normalizePath(outputTarget.baseUrl);
  if (!outputTarget.baseUrl.startsWith('/')) {
    throw new Error(`baseUrl "${outputTarget.baseUrl}" must start with a slash "/". This represents an absolute path to the root of the domain.`);
  }

  if (!outputTarget.baseUrl.endsWith('/')) {
    outputTarget.baseUrl += '/';
  }

  if (!Array.isArray(outputTarget.prerenderLocations)) {
    outputTarget.prerenderLocations = [];
  }

  if (outputTarget.prerenderLocations.length === 0) {
    outputTarget.prerenderLocations.push({
      path: outputTarget.baseUrl
    });
  }
}


const DEFAULT_MAX_CONCURRENT = 30;
const DEFAULT_BASE_URL = '/';
const DEFAULT_REMOVE_UNUSED_STYLES = true;
