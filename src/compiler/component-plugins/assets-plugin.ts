import { AssetsMeta, BuildConfig, ComponentOptions, ComponentMeta, Diagnostic, Manifest, ModuleFileMeta } from '../interfaces';
import { catchError, normalizePath } from '../util';
import { getProjectBuildDir } from '../build/build-project-files';


export function parseComponentMetadata(config: BuildConfig, userOpts: ComponentOptions, moduleFile: ModuleFileMeta, cmpMeta: ComponentMeta)  {
  if (userOpts.assetsDir) {
    normalizeAssetDir(config, moduleFile, cmpMeta, userOpts.assetsDir);
  }

  if (Array.isArray(userOpts.assetsDirs)) {
    userOpts.assetsDirs.forEach(assetsDir => {
      normalizeAssetDir(config, moduleFile, cmpMeta, assetsDir);
    });
  }
}


function normalizeAssetDir(config: BuildConfig, moduleFile: ModuleFileMeta, cmpMeta: ComponentMeta, assetsDir: string) {
  if (typeof assetsDir !== 'string' || assetsDir.trim() === '') return;

  const assetsMeta: AssetsMeta = {};

  // get the absolute path of the directory which the component is sitting in
  const componentDir = normalizePath(config.sys.path.dirname(moduleFile.tsFilePath));

  // get the relative path from the component file to the assets directory
  assetsDir = normalizePath(assetsDir.trim());

  if (config.sys.path.isAbsolute(assetsDir)) {
    // this path is absolute already!
    // add as the absolute path
    assetsMeta.absolutePath = assetsDir;

    // if this is an absolute path already, let's convert it to be relative
    assetsMeta.cmpRelativePath = config.sys.path.relative(componentDir, assetsDir);

  } else {
    // this path is relative to the component
    assetsMeta.cmpRelativePath = assetsDir;

    // create the absolute path to the asset dir
    assetsMeta.absolutePath = normalizePath(config.sys.path.join(componentDir, assetsDir));
  }

  (cmpMeta.assetsDirsMeta = cmpMeta.assetsDirsMeta || []).push(assetsMeta);
}


export function copyAssets(config: BuildConfig, userManifest: Manifest, diagnostics: Diagnostic[]) {
  const timeSpan = config.logger.createTimeSpan(`copy assets started`, true);

  // get a list of all the directories to copy
  // these paths should be absolute
  const assetDirsToCopy = userManifest.components
    .filter(c => c.assetsDirsMeta && c.assetsDirsMeta.length)
    .reduce((dirList, component) => {
      const qualifiedPathDirs = component.assetsDirsMeta.map(assetDirAbsolutePath => {
        return assetDirAbsolutePath;
      });
    return dirList.concat(qualifiedPathDirs);
  }, <AssetsMeta[]>[]);


  // copy all of the files in asset directories to the project's build directory
  let dirCopyPromises = assetDirsToCopy.map(assetsMeta => {
    return new Promise((resolve, reject) => {
      // figure out what the path is to the component directory
      const buildDirDestination = normalizePath(config.sys.path.join(
        getProjectBuildDir(config),
        assetsMeta.cmpRelativePath
      ));

      // let's copy!
      config.sys.copyDir(assetsMeta.absolutePath, buildDirDestination, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });


  // copy all of the files in asset directories to the dist/collection directory
  // but only do this copy when the generateCollection flag is set to true
  if (config.generateCollection) {

    // copy all of the files in asset directories to the project's collection directory
    dirCopyPromises = dirCopyPromises.concat(assetDirsToCopy.map(assetsMeta => {
      return new Promise((resolve, reject) => {
        // figure out what the path is to the component directory
        const collectionDirDestination = normalizePath(config.sys.path.join(
          config.collectionDir,
          config.sys.path.relative(config.src, assetsMeta.absolutePath)
        ));

        // let's copy!
        config.sys.copyDir(assetsMeta.absolutePath, collectionDirDestination, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }));
  }

  return Promise.all(dirCopyPromises).catch(err => {
    catchError(diagnostics, err);

  }).then(function() {
    timeSpan.finish('copy assets finished');
  });
}
