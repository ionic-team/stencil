import * as d from '@declarations';
import { normalizePath } from '@utils';
import { setStringConfig } from './config-utils';
import { sys } from '@sys';


export function validatePrerender(config: d.Config, outputTarget: d.OutputTargetWww) {
  if (!config.flags || !config.flags.prerender) {
    return;
  }

  setStringConfig(outputTarget, 'baseUrl', '/');

  outputTarget.baseUrl = normalizePath(outputTarget.baseUrl);
  if (!outputTarget.baseUrl.startsWith('/')) {
    throw new Error(`baseUrl "${outputTarget.baseUrl}" must start with a slash "/". This represents an absolute path to the root of the domain.`);
  }

  if (!outputTarget.baseUrl.endsWith('/')) {
    outputTarget.baseUrl += '/';
  }

  if (typeof outputTarget.prerenderConfig === 'string') {
    if (!sys.path.isAbsolute(outputTarget.prerenderConfig)) {
      outputTarget.prerenderConfig = sys.path.join(config.rootDir, outputTarget.prerenderConfig);
    }
  }
}
