import * as d from '../../declarations';
import { normalizePath } from '@utils';


export function inMemoryFsRead(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const path = config.sys.path;
  return {
    name: 'inMemoryFsRead',

    async resolveId(importee: string, importer: string) {
      if (/\0/.test(importee)) {
        // ignore IDs with null character, these belong to other plugins
        return null;
      }
      // skip non-paths
      if (importee[0] !== '.' && importee[0] !== '/') {
        return null;
      }

      // note: node-resolve plugin has already ran
      // we can assume the importee is a file path
      if (!buildCtx.isActiveBuild) {
        return importee;
      }

      // Resolve absolute path
      if (!path.isAbsolute(importee)) {
        importee = path.resolve(importer ? path.dirname(importer) : path.resolve(), importee);
      }

      importee = normalizePath(importee);
      const importeeDir = path.dirname(importee);
      const importeeBase = path.basename(importee);

      // Direct FS check
      let filePath = importee;
      let accessData = await compilerCtx.fs.accessData(filePath);
      if (accessData.exists) {
        return accessData.isFile ? filePath : path.join(filePath, '/index.js');
      }

      filePath = path.join(importeeDir, importeeBase) + '.js';
      accessData = await compilerCtx.fs.accessData(filePath);
      if (accessData.exists) {
        return filePath;
      }
      console.error('path not found', importee);

      return null;
    },

    async load(sourcePath: string) {
      if (!buildCtx.isActiveBuild) {
        return `/* build aborted */`;
      }
      return compilerCtx.fs.readFile(sourcePath);
    }
  };
}
