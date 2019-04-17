import * as d from '../../declarations';
import { normalizePath } from '@utils';


export function inMemoryFsRead(config: d.Config, compilerCtx: d.CompilerCtx, _buildCtx: d.BuildCtx) {
  const path = config.sys.path;
  return {
    name: 'inMemoryFsRead',

    async resolveId(importee: string, importer: string) {
      if (typeof importee !== 'string' || /\0/.test(importee)) {
        // ignore IDs with null character, these belong to other plugins
        return null;
      }

      // skip non-paths
      if (importee[0] !== '.' && importee[0] !== '/' && importee[1] !== ':') {
        return null;
      }


      // resolve absolute path
      if (!path.isAbsolute(importee)) {
        importee = path.resolve(importer ? path.dirname(importer) : path.resolve(), importee);
      }

      importee = normalizePath(importee);

      let accessData = await compilerCtx.fs.accessData(importee);
      if (accessData.exists) {
        if (accessData.isFile) {
          // exact importee file path exists
          return importee;
        }

        const indexJsFilePath = path.join(importee, 'index.js');
        accessData = await compilerCtx.fs.accessData(indexJsFilePath);
        if (accessData.exists) {
          // ./importee/index.js
          return indexJsFilePath;
        }

        const indexMjsFilePath = path.join(importee, 'index.mjs');
        accessData = await compilerCtx.fs.accessData(indexMjsFilePath);
        if (accessData.exists) {
          // ./importee/index.mjs
          return indexMjsFilePath;
        }
      }

      // ./importee.js
      const jsFilePath = importee + '.js';
      accessData = await compilerCtx.fs.accessData(jsFilePath);
      if (accessData.exists) {
        return jsFilePath;
      }

      // ./importee.mjs
      const mjsFilePath = importee + '.mjs';
      accessData = await compilerCtx.fs.accessData(mjsFilePath);
      if (accessData.exists) {
        return mjsFilePath;
      }

      return null;
    },

    async load(sourcePath: string) {
      return compilerCtx.fs.readFile(sourcePath);
    }
  };
}
