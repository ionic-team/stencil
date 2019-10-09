import * as d from '../../declarations';
import { normalizePath } from '@utils';
import { Plugin } from 'rollup';
import path from 'path';


export const sysPlugin = (fs: d.InMemoryFileSystem): Plugin => {
  return {
    name: 'sysPlugin',

    async resolveId(importee, importer) {
      if (/\0/.test(importee)) {
        // ignore IDs with null character, these belong to other plugins
        return null;
      }

      if (importer) {
        const importerDir = path.dirname(importer);
        const resolvedPath = normalizePath(path.resolve(importerDir, importee));

        for (const ext of EXTS) {
          const p = resolvedPath + ext;
          const hasAccess = await fs.access(p);
          if (hasAccess) {
            return p;
          }
        }

        return null;
      }

      if (path.isAbsolute(importee)) {
        importee = normalizePath(importee);
        for (const ext of EXTS) {
          const p = importee + ext;
          const hasAccess = await fs.access(p);
          if (hasAccess) {
            return p;
          }
        }
      }

      return null;
    },

    load(id) {
      return fs.readFile(id);
    }
  };
};


const EXTS = [
  '',
  '.tsx',
  '.ts',
  '.mjs',
  '.js'
];
