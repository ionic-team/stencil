import * as d from '../../declarations';
import { normalizePath } from '@stencil/core/utils';


export default function localResolution(config: d.Config, compilerCtx: d.CompilerCtx) {
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

      const basename = config.sys.path.basename(importer);
      const directory = importer.split(basename)[0];

      const dirIndexFile = config.sys.path.join(directory + importee, 'index.js');

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
