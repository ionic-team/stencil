import { Plugin } from 'rollup';
import path from 'path';

export const textPlugin = (): Plugin => {
  return {
    name: 'textPlugin',

    transform(code, id) {
      if (KNOWN_TXT_EXTS.has(path.extname(id))) {
        return `export default ${JSON.stringify(code)};`;
      }
      return null;
    }
  };
};

const KNOWN_TXT_EXTS = new Set(['.txt', '.frag', '.vert']);
