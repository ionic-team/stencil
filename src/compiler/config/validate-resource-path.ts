import * as d from '../../declarations';
import { normalizePath } from '../util';


export function validateResourcePath(outputTarget: d.OutputTargetWww) {
  if (typeof outputTarget.resourcePath === 'string') {
    outputTarget.resourcePath = normalizePath(outputTarget.resourcePath.trim());

    if (outputTarget.resourcePath.charAt(outputTarget.resourcePath.length - 1) !== '/') {
      // ensure there's a trailing /
      outputTarget.resourcePath += '/';
    }
  }
}
