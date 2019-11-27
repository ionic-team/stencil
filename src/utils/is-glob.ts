/*!
 * Ported to ESM from:
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
import { isString } from './helpers';

const isGlobChars: any = { '{': '}', '(': ')', '[': ']'};
const isGlobStrictRegex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;


const isExtglobRegex = /(\\).|([@?!+*]\(.*\))/;
const isExtglob = (str: string) => {
  let match: RegExpExecArray;
  while ((match = isExtglobRegex.exec(str))) {
    if (match[2]) {
      return true;
    }
    str = str.slice(match.index + match[0].length);
  }
  return false;
};


export const isGlob = (str: string) => {
  if (!isString(str) || str === '') {
    return false;
  }

  if (isExtglob(str)) {
    return true;
  }

  const regex = isGlobStrictRegex;
  let match: RegExpExecArray;

  while ((match = regex.exec(str))) {
    if (match[2]) {
      return true;
    }

    let idx = match.index + match[0].length;

    // if an open bracket/brace/paren is escaped,
    // set the index to the next closing character
    const open = match[1];
    const close = open ? isGlobChars[open] : null;

    if (open && close) {
      const n = str.indexOf(close, idx);
      if (n !== -1) {
        idx = n + 1;
      }
    }

    str = str.slice(idx);
  }

  return false;
};
