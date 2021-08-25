import type * as d from '../../declarations';
import { normalizeFsPath } from '@utils';
import type { Plugin } from 'rollup';

/**
 * Used to filter out .d.ts files from being loaded, but load everything else that matches. Seems to be a feature of incremental load.
 * @param fs An in-memory file system shim must be passed to this.
 * @returns
 */
export const fileLoadPlugin = (fs: d.InMemoryFileSystem): Plugin => {
  return {
    name: 'fileLoadPlugin',

    load(id) {
      const fsFilePath = normalizeFsPath(id);
      if (id.endsWith('.d.ts')) {
        return '';
      }
      return fs.readFile(fsFilePath);
    },
  };
};
