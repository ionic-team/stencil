import * as d from '@declarations';
import { normalizePath } from '@utils';
import { setStringConfig } from './config-utils';


export function validatePrerender(config: d.Config, outputTarget: d.OutputTargetWww) {
  if (!config.flags || !config.flags.prerender) {
    return;
  }

  setStringConfig(outputTarget, 'baseUrl', DEFAULT_BASE_URL);

  outputTarget.baseUrl = normalizePath(outputTarget.baseUrl);
  if (!outputTarget.baseUrl.startsWith('/')) {
    throw new Error(`baseUrl "${outputTarget.baseUrl}" must start with a slash "/". This represents an absolute path to the root of the domain.`);
  }

  if (!outputTarget.baseUrl.endsWith('/')) {
    outputTarget.baseUrl += '/';
  }

  if (Array.isArray(outputTarget.prerenderLocations) === false) {
    outputTarget.prerenderLocations = [];
  }

  if (outputTarget.prerenderLocations.length === 0) {
    outputTarget.prerenderLocations.push(outputTarget.baseUrl);
  }
}


const DEFAULT_BASE_URL = '/';
