import * as d from '@declarations';
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
      const importeeExt = path.extname(importee);

      // Test .ts extension
      let moduleFile = compilerCtx.moduleMap.get(path.join(importeeDir, importeeBase) + '.ts');
      if (moduleFile != null && typeof moduleFile.jsFilePath === 'string') {
        return moduleFile.jsFilePath;
      }

      // Direct FS check
      const accessData = await compilerCtx.fs.accessData(importee);
      if (accessData.exists) {
        return accessData.isFile ? importee : path.join(importee, '/index.js');
      }

      // Test .ts extension
      moduleFile = compilerCtx.moduleMap.get(path.join(importeeDir, importeeBase) + '.js');
      if (moduleFile != null && typeof moduleFile.jsFilePath === 'string') {
        return moduleFile.jsFilePath;
      }

      // Test original extension
      moduleFile = compilerCtx.moduleMap.get(path.join(importeeDir, importeeBase) + importeeExt);
      if (moduleFile != null && typeof moduleFile.jsFilePath === 'string') {
        return moduleFile.jsFilePath;
      }

      // No extension
      if (importeeExt === '') {
        // Test original extension
        moduleFile = compilerCtx.moduleMap.get(path.join(importeeDir, importeeBase, 'index.js'));
        if (moduleFile != null && typeof moduleFile.jsFilePath === 'string') {
          return moduleFile.jsFilePath;
        }
      }
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
