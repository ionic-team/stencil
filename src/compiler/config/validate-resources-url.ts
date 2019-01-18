import * as d from '@declarations';
import { normalizePath } from '@stencil/core/utils';


export function validateResourcesUrl(outputTarget: d.OutputTargetBuild) {
  if (typeof outputTarget.resourcesUrl === 'string') {
    outputTarget.resourcesUrl = normalizePath(outputTarget.resourcesUrl.trim());

    if (outputTarget.resourcesUrl.charAt(outputTarget.resourcesUrl.length - 1) !== '/') {
      // ensure there's a trailing /
      outputTarget.resourcesUrl += '/';
    }
  }
}
