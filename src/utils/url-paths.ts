import { isString } from './helpers';

/**
 * Determines whether a string should be considered a remote url or not
 * @param p the string to evaluate
 * @returns `true` if the provided string is a remote url, `false` otherwise
 */
export const isRemoteUrl = (p: string): boolean => {
  if (isString(p)) {
    p = p.toLowerCase();
    return p.startsWith('https://') || p.startsWith('http://');
  }
  return false;
};
