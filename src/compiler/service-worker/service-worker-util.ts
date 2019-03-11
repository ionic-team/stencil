import * as d from '@declarations';
import { normalizePath } from '@utils';


export function generateServiceWorkerUrl(config: d.Config, outputTarget: d.OutputTargetWww) {
  let swUrl = normalizePath(config.sys.path.relative(
    outputTarget.dir,
    outputTarget.serviceWorker.swDest
  ));

  if (swUrl.charAt(0) !== '/') {
    swUrl = '/' + swUrl;
  }

  swUrl = outputTarget.baseUrl + swUrl.substring(1);

  return swUrl;
}
