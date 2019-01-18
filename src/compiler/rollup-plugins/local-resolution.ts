import * as d from '@declarations';
import { normalizePath } from '@utils';
import { sys } from '@sys';


export default function localResolution(compilerCtx: d.CompilerCtx) {
  return {
    name: 'localResolution',

    async resolveId(importee: string, importer: string) {
      if (/\0/.test(importee)) {
        // ignore IDs with null character, these belong to other plugins
        return null;
      }

      importee = normalizePath(importee);

      if (importee.indexOf('./') === -1) {
        return null;
      }

      if (!importer) {
        return null;
      }
      importer = normalizePath(importer);

      if (importee.endsWith('.js') || importee.endsWith('.mjs')) {
        return null;
      }

      const basename = sys.path.basename(importer);
      const directory = importer.split(basename)[0];

      const dirIndexFile = sys.path.join(directory + importee, 'index.js');

      let stats;
      try {
        stats = await compilerCtx.fs.stat(dirIndexFile);
      } catch (e) {
        return null;
      }

      if (stats.isFile) {
        return dirIndexFile;
      }

      return null;
    }
  };
}
