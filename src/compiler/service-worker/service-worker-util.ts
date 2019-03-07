import * as d from '@declarations';
import { normalizePath } from '@utils';
import { sys } from '@sys';


export function generateServiceWorkerUrl(outputTarget: d.OutputTargetWww) {
  let swUrl = normalizePath(sys.path.relative(
    outputTarget.dir,
    outputTarget.serviceWorker.swDest
  ));

  if (swUrl.charAt(0) !== '/') {
    swUrl = '/' + swUrl;
  }

  swUrl = outputTarget.baseUrl + swUrl.substring(1);

  return swUrl;
}
