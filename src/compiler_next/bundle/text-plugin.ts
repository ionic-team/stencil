import { Plugin } from 'rollup';
import { extname } from 'path';

export const textPlugin = (): Plugin => {
  return {
    name: 'textPlugin',

    transform(code, id) {
      if (/\0/.test(id)) {
        return null;
      }
      if (KNOWN_TXT_EXTS.has(extname(id))) {
        return `export default ${JSON.stringify(code)};`;
      }
      return null;
    },
  };
};

const KNOWN_TXT_EXTS = new Set(['.txt', '.frag', '.vert']);
