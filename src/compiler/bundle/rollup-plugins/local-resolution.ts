import { CompilerCtx, Config } from '../../../declarations';
import { normalizePath } from '../../util';


export default function localResolver(config: Config, compilerCtx: CompilerCtx) {
  return {
    name: 'localResolverPlugin',

    async resolveId(importee: string, importer: string) {
      importee = normalizePath(importee);
      importer = normalizePath(importer);

      if (importee.indexOf('./') === -1) {
        return null;
      }

      if (!importer) {
        return null;
      }

      if (importee.endsWith('.js')) {
        return null;
      }

      const basename = config.sys.path.basename(importer);
      const directory = importer.split(basename)[0];

      const dirIndexFile = config.sys.path.join(directory + importee, 'index.js');

      const hasAccess = compilerCtx.fs.access(dirIndexFile);
      if (hasAccess) {
        return dirIndexFile;
      }

      return null;
    },
  };
}
