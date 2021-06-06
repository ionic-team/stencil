import { isString } from './helpers';
import { normalizePath } from './normalize-path';

export const isRemoteUrl = (p: string) => {
  if (isString(p)) {
    p = p.toLowerCase();
    return p.startsWith('https://') || p.startsWith('http://');
  }
  return false;
};

export const isFileUrl = (p: string) => (isString(p) ? p.toLowerCase().startsWith('file:/') : false);

export const convertPathToFileProtocol = (p: string) => {
  if (isString(p) && !isRemoteUrl(p) && !isFileUrl(p)) {
    if (isFileUrl(p)) {
      p = new URL(p).href;
    } else {
      p = normalizePath(p);
      if (p.startsWith('/')) {
        p = 'file://' + p;
      } else {
        p = 'file:///' + p;
      }
    }
  }
  return p;
};
