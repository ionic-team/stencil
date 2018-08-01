import { CompilerCtx, Config } from '../../../declarations';
import { normalizePath } from '../../util';


export default function localResolution(config: Config, compilerCtx: CompilerCtx) {
  return {
    name: 'localResolution',

    async resolveId(importee: string, importer: string) {
      importee = normalizePath(importee);

      if (importee.indexOf('./') === -1) {
        return null;
      }

      if (!importer) {
        return null;
      }
      importer = normalizePath(importer);

      if (importee.endsWith('.js')) {
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
