import { normalizePath } from '../util';
import { OutputTarget } from '../../declarations';


export function validateResourcePath(outputTarget: OutputTarget) {
  if (outputTarget.type !== 'www' && outputTarget.type !== 'dist') {
    return;
  }

  if (typeof outputTarget.resourcePath === 'string') {
    outputTarget.resourcePath = normalizePath(outputTarget.resourcePath.trim());

    if (outputTarget.resourcePath.charAt(outputTarget.resourcePath.length - 1) !== '/') {
      // ensure there's a trailing /
      outputTarget.resourcePath += '/';
    }
  }
}
