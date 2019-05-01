import * as d from '../../declarations';
import { normalizePath } from '@utils';
import { URL } from 'url';


export function validatePrerender(config: d.Config, outputTarget: d.OutputTargetWww) {
  if (!config.flags || !config.flags.prerender) {
    return;
  }

  outputTarget.baseUrl = normalizePath(outputTarget.baseUrl);

  if (!outputTarget.baseUrl.startsWith('http://') && !outputTarget.baseUrl.startsWith('https://')) {
    throw new Error(`When prerendering, the "baseUrl" output target config must be a full URL and start with either "http://" or "https://". The config can be updated in the "www" output target within the stencil config.`);
  }

  try {
    new URL(outputTarget.baseUrl);
  } catch (e) {
    throw new Error(`invalid "baseUrl": ${e}`);
  }

  if (!outputTarget.baseUrl.endsWith('/')) {
    outputTarget.baseUrl += '/';
  }

  if (typeof outputTarget.prerenderConfig === 'string') {
    if (!config.sys.path.isAbsolute(outputTarget.prerenderConfig)) {
      outputTarget.prerenderConfig = config.sys.path.join(config.rootDir, outputTarget.prerenderConfig);
    }
  }
}
