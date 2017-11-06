import { BuildConfig } from '../../../util/interfaces';


export default function localResolver(config: BuildConfig) {
  return {
    async resolveId(importee: string, importer: string) {
      if (importee.indexOf('./') === -1) {
        return null;
      }

      if (!importer) {
        return null;
      }

      const basename = config.sys.path.basename(importer);
      const directory = importer.split(basename)[0];

      const dirIndexFile = config.sys.path.join(directory + importee, 'index.js');

      try {
        await config.sys.ensureFile(dirIndexFile);
        return dirIndexFile;
      } catch (e) {}

      return null;
    },
  };
}
