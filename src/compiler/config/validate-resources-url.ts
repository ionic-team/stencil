import { normalizePath } from '@utils';


export function validateResourcesUrl(resourcesUrl: string) {
  if (typeof resourcesUrl === 'string') {
    resourcesUrl = normalizePath(resourcesUrl.trim());

    if (resourcesUrl.charAt(resourcesUrl.length - 1) !== '/') {
      // ensure there's a trailing /
      resourcesUrl += '/';
    }
  }
  return resourcesUrl;
}
