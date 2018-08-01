import * as d from '../../../declarations';
import { ENTRY_KEY_PREFIX } from '../../entries/entry-modules';
import { normalizePath } from '../../util';


export default function inMemoryFsRead(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules?: d.EntryModule[]) {
  const path = config.sys.path;
  const assetsCache: d.FilesMap = {};
  let tsFileNames: string[];

  return {
    name: 'inMemoryFsRead',

    async resolveId(importee: string, importer: string) {
      // note: node-resolve plugin has already ran
      // we can assume the importee is a file path
      if (!buildCtx.isActiveBuild) {
        return importee;
      }

      const orgImportee = importee;

      // Entry files live in inMemoryFs
      if (path.basename(importee).startsWith(ENTRY_KEY_PREFIX) && entryModules) {
        const bundle = entryModules.find(b => b.filePath === importee);
        if (bundle) {
          return bundle.filePath;
        }

        buildCtx.debug(`bundleEntryFilePlugin resolveId, unable to find entry key: ${importee}`);
        buildCtx.debug(`entryModules entryKeys: ${entryModules.map(em => em.filePath).join(', ')}`);
      }

      if (!path.isAbsolute(importee)) {
        importee = path.resolve(importer ? path.dirname(importer) : path.resolve(), importee);

        if (!importee.endsWith('.js')) {
          importee += '.js';
        }
      }
      importee = normalizePath(importee);

      // it's possible the importee is a file pointing directly to the source ts file
      // if it is a ts file path, then we're good to go
      var moduleFile = compilerCtx.moduleFiles[importee];
      if (compilerCtx.moduleFiles[importee]) {
        return moduleFile.jsFilePath;
      }

      if (!tsFileNames) {
        // get all the module files as filenames
        // caching the filenames so we don't have to keep doing this
        tsFileNames = Object.keys(compilerCtx.moduleFiles);
      }

      for (let i = 0; i < tsFileNames.length; i++) {
        // see if we can find by importeE
        moduleFile = compilerCtx.moduleFiles[tsFileNames[i]];
        const moduleJsFilePath = moduleFile.jsFilePath;

        if (moduleJsFilePath === importee) {
          // exact match
          return importee;
        }

        if (!importee.endsWith('.js') && moduleJsFilePath === importee + '.js') {
          // try by appending .js
          return `${importee}.js`;
        }

        if (!importee.endsWith('/index.js') && moduleJsFilePath === importee + '/index.js') {
          // try by appending /index.js
          return `${importee}/index.js`;
        }
      }

      if (typeof importer === 'string' && !path.isAbsolute(orgImportee)) {
        // no luck finding the path the importee
        // try again by using the importers source path and original importee
        // get the original ts source path importer from this js path importer
        for (let i = 0; i < tsFileNames.length; i++) {
          const tsFilePath = tsFileNames[i];
          moduleFile = compilerCtx.moduleFiles[tsFilePath];
          if (moduleFile.jsFilePath !== importer) {
            continue;
          }

          // found the importer's module file using importer's jsFilePath
          // create an importee path using the source of the importers original ts file path
          const srcImportee = normalizePath(path.resolve(path.dirname(tsFilePath), orgImportee));

          let accessData = await compilerCtx.fs.accessData(srcImportee);
          if (accessData.isFile) {
            return srcImportee;
          }

          if (!srcImportee.endsWith('/index.js')) {
            accessData = await compilerCtx.fs.accessData(srcImportee + '/index.js');
            if (accessData.isFile) {
              return srcImportee + '/index.js';
            }
          }

          if (!srcImportee.endsWith('.js')) {
            accessData = await compilerCtx.fs.accessData(srcImportee + '.js');
            if (accessData.isFile) {
              return srcImportee + '.js';
            }
          }

          break;
        }
      }

      // let's check all of the asset directories for this path
      // think slide's swiper dependency
      for (let i = 0; i < tsFileNames.length; i++) {
        // see if we can find by importeR
        moduleFile = compilerCtx.moduleFiles[tsFileNames[i]];
        if (moduleFile.jsFilePath === importer) {
          // awesome, there's a module file for this js file via importeR
          // now let's check if this module has an assets directory
          if (moduleFile.cmpMeta && moduleFile.cmpMeta.assetsDirsMeta) {
            for (var j = 0; j < moduleFile.cmpMeta.assetsDirsMeta.length; j++) {
              const assetsAbsPath = moduleFile.cmpMeta.assetsDirsMeta[j].absolutePath;
              const importeeFileName = path.basename(importee);
              const assetsFilePath = normalizePath(path.join(assetsAbsPath, importeeFileName));

              // ok, we've got a potential absolute path where the file "could" be
              try {
                // let's see if it actually exists, but with readFileSync :(
                assetsCache[assetsFilePath] = compilerCtx.fs.readFileSync(assetsFilePath);
                if (typeof assetsCache[assetsFilePath] === 'string') {
                  return assetsFilePath;
                }

              } catch (e) {
                buildCtx.debug(`asset ${assetsFilePath} did not exist`);
              }
            }
          }
        }
      }

      return null;
    },

    async load(sourcePath: string) {
      if (!buildCtx.isActiveBuild) {
        return `/* build aborted */`;
      }

      sourcePath = normalizePath(sourcePath);

      if (typeof assetsCache[sourcePath] === 'string') {
        // awesome, this is one of the cached asset file we already read in resolveId
        return assetsCache[sourcePath];
      }

      return compilerCtx.fs.readFile(sourcePath);
    }
  };
}
