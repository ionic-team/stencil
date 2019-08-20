import { CompilerOptions, nodeModuleNameResolver } from 'typescript';
import * as d from '../../declarations';
import { normalizePath } from '@utils';
import { Plugin } from 'rollup';

export function inMemoryFsRead(config: d.Config, compilerCtx: d.CompilerCtx): Plugin {
  const path = config.sys.path;
  const compilerOptions: CompilerOptions = compilerCtx.compilerOptions;

  return {
    name: 'inMemoryFsRead',

    async resolveId(importee: string, importer: string) {
      if (typeof importee !== 'string' || /\0/.test(importee)) {
        // ignore IDs with null character, these belong to other plugins
        return null;
      }

      // resolve path that matches a path alias from the compiler options
      if (compilerOptions.paths && hasMatchingPathAlias(importee, compilerOptions)) {
        return resolveWithPathAlias(importee, importer, compilerCtx, path);
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

      // 1. load(importee)
      let accessData = await compilerCtx.fs.accessData(importee);
      if (accessData.exists && accessData.isFile) {
        // exact importee file path exists
        return importee;
      }

      // 2. load(importee.js)
      const jsFilePath = importee + '.js';
      accessData = await compilerCtx.fs.accessData(jsFilePath);
      if (accessData.exists) {
        return jsFilePath;
      }

      // 3. load(importee.mjs)
      const mjsFilePath = importee + '.mjs';
      accessData = await compilerCtx.fs.accessData(mjsFilePath);
      if (accessData.exists) {
        return mjsFilePath;
      }

      // 4. load(importee/index.js)
      const indexJsFilePath = path.join(importee, 'index.js');
      accessData = await compilerCtx.fs.accessData(indexJsFilePath);
      if (accessData.exists) {
        return indexJsFilePath;
      }

      // 5. load(importee/index.mjs)
      const indexMjsFilePath = path.join(importee, 'index.mjs');
      accessData = await compilerCtx.fs.accessData(indexMjsFilePath);
      if (accessData.exists) {
        return indexMjsFilePath;
      }

      return null;
    },

    async load(sourcePath: string) {
      if (/\.tsx?$/i.test(sourcePath)) {
        this.warn({
          message: `An import was resolved to a Typescript file (${sourcePath}) but Rollup treated it as Javascript. You should instead resolve to the absolute path of its transpiled Javascript equivalent (${path.resolve(sourcePath.replace(/\.tsx?/i, '.js'))}).`,
        });
      }

      sourcePath = sourcePath.split('?')[0];

      return compilerCtx.fs.readFile(sourcePath);
    }
  };
}

/**
 * Check whether an importee has a matching path alias.
 */
const hasMatchingPathAlias = (importee: string, compilerOptions: CompilerOptions) =>
  Object.keys(compilerOptions.paths).some(path => new RegExp(path.replace('*', '\\w*')).test(importee));

/**
 * Resolve an import using the path aliases of the compiler options.
 *
 * @returns the `.js` file corresponding to the resolved `.ts` file, or `null`
 * if the import can't be resolved
 */
const resolveWithPathAlias = async (importee: string, importer: string, compilerCtx: d.CompilerCtx, path: d.Path) => {
  const { resolvedModule } = nodeModuleNameResolver(importee, importer, compilerCtx.compilerOptions, {
    readFile: compilerCtx.fs.readFileSync,
    fileExists: fileName => compilerCtx.fs.statSync(fileName).isFile,
  });

  if (!resolvedModule) {
    return null;
  }

  const { resolvedFileName } = resolvedModule; // this is the .ts(x) path

  if (!resolvedFileName || resolvedFileName.endsWith('.d.ts')) {
    return null;
  }

  // check whether the .js counterpart exists
  const jsFilePath = path.resolve(resolvedFileName.replace(/\.tsx?$/i, '.js'));
  const { exists } = await compilerCtx.fs.accessData(jsFilePath);

  return exists ? jsFilePath : null;
};

