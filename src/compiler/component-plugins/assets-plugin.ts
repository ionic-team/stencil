import { AssetsMeta, BuildConfig, BuildContext, ComponentOptions, ComponentMeta, ModuleFile } from '../../util/interfaces';
import { catchError, normalizePath } from '../util';
import { getProjectBuildDir } from '../project/generate-project-files';


export function normalizeAssetsDir(config: BuildConfig, userOpts: ComponentOptions, moduleFile: ModuleFile, cmpMeta: ComponentMeta)  {
  if (userOpts.assetsDir) {
    normalizeAssetDir(config, moduleFile, cmpMeta, userOpts.assetsDir);
  }

  if (Array.isArray(userOpts.assetsDirs)) {
    userOpts.assetsDirs.forEach(assetsDir => {
      normalizeAssetDir(config, moduleFile, cmpMeta, assetsDir);
    });
  }
}


function normalizeAssetDir(config: BuildConfig, moduleFile: ModuleFile, cmpMeta: ComponentMeta, assetsDir: string) {
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


export function copyAssets(config: BuildConfig, ctx: BuildContext) {
  const timeSpan = config.logger.createTimeSpan(`copy assets started`, true);

  // get a list of all the directories to copy
  // these paths should be absolute
  const copyToBuildDir: AssetsMeta[] = [];
  const copyToCollectionDir: AssetsMeta[] = [];

  ctx.manifest.modulesFiles.forEach(moduleFile => {
    if (!moduleFile.cmpMeta.assetsDirsMeta || !moduleFile.cmpMeta.assetsDirsMeta.length) return;

    moduleFile.cmpMeta.assetsDirsMeta.forEach(assetsMeta => {
      copyToBuildDir.push(assetsMeta);

      if (!moduleFile.isCollectionDependency) {
        copyToCollectionDir.push(assetsMeta);
      }
    });
  });


  // copy all of the files in asset directories to the project's build directory
  let dirCopyPromises = copyToBuildDir.map(assetsMeta => {
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
    dirCopyPromises = dirCopyPromises.concat(copyToCollectionDir.map(assetsMeta => {
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
    catchError(ctx.diagnostics, err);

  }).then(function() {
    timeSpan.finish('copy assets finished');
  });
}
