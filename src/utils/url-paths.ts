import { isString } from './helpers';

export const isRemoteUrl = (p: string) => {
  if (isString(p)) {
    p = p.toLowerCase();
    return p.startsWith('https://') || p.startsWith('http://');
  }
  return false;
};
