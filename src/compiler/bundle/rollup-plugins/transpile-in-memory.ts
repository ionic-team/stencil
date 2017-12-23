import { BuildConfig, BuildContext, FilesMap } from '../../../util/interfaces';
import { normalizePath } from '../../util';

export default function transpiledInMemoryPlugin(config: BuildConfig, ctx: BuildContext) {
  const sys = config.sys;
  const assetsCache: FilesMap = {};

  return {
    name: 'transpiledInMemoryPlugin',

    resolveId(importee: string, importer: string): string {
      if (!sys.path.isAbsolute(importee)) {
        importee = normalizePath(sys.path.resolve(importer ? sys.path.dirname(importer) : sys.path.resolve(), importee));

        if (importee.indexOf('.js') === -1) {
          importee += '.js';
        }
      }

      // it's possible the importee is a file pointing directly to the source ts file
      // if it is a ts file path, then we're good to go
      var moduleFile = ctx.moduleFiles[importee];
      if (ctx.moduleFiles[importee]) {
        return moduleFile.jsFilePath;
      }

      const tsFileNames = Object.keys(ctx.moduleFiles);
      for (var i = 0; i < tsFileNames.length; i++) {
        // see if we can find by importeE
        moduleFile = ctx.moduleFiles[tsFileNames[i]];
        if (moduleFile.jsFilePath === importee) {
          // awesome, there's a module file for this js file, we're good here
          return importee;
        }
      }

      // let's check all of the asset directories for this path
      // think slide's swiper dependency
      for (i = 0; i < tsFileNames.length; i++) {
        // see if we can find by importeR
        moduleFile = ctx.moduleFiles[tsFileNames[i]];
        if (moduleFile.jsFilePath === importer) {
          // awesome, there's a module file for this js file via importeR
          // now let's check if this module has an assets directory
          if (moduleFile.cmpMeta && moduleFile.cmpMeta.assetsDirsMeta) {
            for (var j = 0; j < moduleFile.cmpMeta.assetsDirsMeta.length; j++) {
              var assetsAbsPath = moduleFile.cmpMeta.assetsDirsMeta[j].absolutePath;
              var importeeFileName = sys.path.basename(importee);
              var assetsFilePath = normalizePath(sys.path.join(assetsAbsPath, importeeFileName));

              // ok, we've got a potential absolute path where the file "could" be
              try {
                // let's see if it actually exists, but with readFileSync :(
                assetsCache[assetsFilePath] = sys.fs.readFileSync(assetsFilePath, 'utf-8');
                if (typeof assetsCache[assetsFilePath] === 'string') {
                  return assetsFilePath;
                }

              } catch (e) {
                config.logger.debug(`asset ${assetsFilePath} did not exist`);
              }
            }
          }
        }
      }
      return null;
    },

    load(sourcePath: string): string {
      sourcePath = normalizePath(sourcePath);

      if (typeof ctx.jsFiles[sourcePath] === 'string') {
        // perfect, we already got this js file cached
        return ctx.jsFiles[sourcePath];
      }

      if (typeof assetsCache[sourcePath] === 'string') {
        // awesome, this is one of the cached asset file we already read in resolveId
        return assetsCache[sourcePath];
      }

      // ok so it's not in one of our caches, so let's look it up directly
      // but with readFileSync :(
      const jsText = sys.fs.readFileSync(sourcePath, 'utf-8' );
      ctx.moduleFiles[sourcePath] = {
        jsFilePath: sourcePath,
      };
      ctx.jsFiles[sourcePath] = jsText;

      return jsText;
    }
  };
}
