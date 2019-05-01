import * as d from '../../declarations';
import { normalizePath } from '@utils';
import { URL } from 'url';


export function generateServiceWorkerUrl(config: d.Config, outputTarget: d.OutputTargetWww) {
  let swUrl = normalizePath(config.sys.path.relative(
    outputTarget.dir,
    outputTarget.serviceWorker.swDest
  ));

  if (swUrl.charAt(0) !== '/') {
    swUrl = '/' + swUrl;
  }

  const baseUrl = new URL(outputTarget.baseUrl, 'http://config.stenciljs.com');
  let basePath = baseUrl.pathname;
  if (!basePath.endsWith('/')) {
    basePath += '/';
  }

  swUrl = basePath + swUrl.substring(1);

  return swUrl;
}
