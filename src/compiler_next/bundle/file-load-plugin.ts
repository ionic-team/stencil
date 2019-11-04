import * as d from '../../declarations';
import { normalizeFsPath } from '@utils';
import { Plugin } from 'rollup';


export const fileLoadPlugin = (fs: d.InMemoryFileSystem): Plugin => {
  return {
    name: 'fileLoadPlugin',

    load(id) {
      const fsFilePath = normalizeFsPath(id);
      return fs.readFile(fsFilePath);
    }

  };
};
