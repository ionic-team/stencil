import { AssetsMeta, BuildCtx, Config, CompilerCtx } from '../../util/interfaces';
import { catchError, normalizePath, pathJoin } from '../util';
import { COLLECTION_DEPENDENCIES_DIR } from '../manifest/manifest-data';
import { getAppDistDir, getAppWWWBuildDir } from '../app/app-file-naming';


export function normalizeAssetsDir(config: Config, componentFilePath: string, assetsMetas: AssetsMeta[])  {
  return assetsMetas.map((assetMeta) => {
    return {
      ...assetMeta,
      ...normalizeAssetDir(config, componentFilePath, assetMeta.originalComponentPath)
    };
  });
}


function normalizeAssetDir(config: Config, componentFilePath: string, assetsDir: string): AssetsMeta {

  const assetsMeta: AssetsMeta = {};

  // get the absolute path of the directory which the component is sitting in
  const componentDir = normalizePath(config.sys.path.dirname(componentFilePath));

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
    assetsMeta.absolutePath = pathJoin(config, componentDir, assetsDir);
  }

  return assetsMeta;
}


export async function copyComponentAssets(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {

  if (skipAssetsCopy(config, compilerCtx, buildCtx)) {
    // no need to recopy all assets again
    return;
  }

  const timeSpan = config.logger.createTimeSpan(`copy assets started`, true);

  try {
    // get a list of all the directories to copy
    // these paths should be absolute
    const copyToBuildDir: AssetsMeta[] = [];
    const copyToCollectionDir: AssetsMeta[] = [];

    buildCtx.manifest.modulesFiles.forEach(moduleFile => {
      if (!moduleFile.cmpMeta.assetsDirsMeta || !moduleFile.cmpMeta.assetsDirsMeta.length) return;

      moduleFile.cmpMeta.assetsDirsMeta.forEach(assetsMeta => {
        copyToBuildDir.push(assetsMeta);

        if (!moduleFile.excludeFromCollection) {
          copyToCollectionDir.push(assetsMeta);
        }
      });
    });

    const dirCopyPromises: Promise<any>[] = [];

    // copy all of the files in asset directories to the app's build and/or dist directory
    copyToBuildDir.forEach(assetsMeta => {
      // figure out what the path is to the component directory
      if (config.generateWWW) {
        const wwwBuildDirDestination = pathJoin(config, getAppWWWBuildDir(config), assetsMeta.cmpRelativePath);

        // let's copy to the www/build directory!
        const copyToWWWBuildDir = compilerCtx.fs.copy(assetsMeta.absolutePath, wwwBuildDirDestination);
        dirCopyPromises.push(copyToWWWBuildDir);
      }

      if (config.generateDistribution) {
        const distDirDestination = pathJoin(config, getAppDistDir(config), assetsMeta.cmpRelativePath);

        // let's copy to the www/build directory!
        const copyToDistDir = compilerCtx.fs.copy(assetsMeta.absolutePath, distDirDestination);
        dirCopyPromises.push(copyToDistDir);
      }
    });


    // copy all of the files in asset directories to the dist/collection directory
    // but only do this copy when the generateCollection flag is set to true
    if (config.generateDistribution) {

      // copy all of the files in asset directories to the app's collection directory
      copyToCollectionDir.forEach(assetsMeta => {
        // figure out what the path is to the component directory
        const collectionDirDestination = getCollectionDirDestination(config, assetsMeta);

        // let's copy to the dist/collection directory!
        const copyToCollectionDir = compilerCtx.fs.copy(assetsMeta.absolutePath, collectionDirDestination);
        dirCopyPromises.push(copyToCollectionDir);
      });
    }

    await Promise.all(dirCopyPromises);

    await compilerCtx.fs.commitCopy();

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish('copy assets finished');
}


export function getCollectionDirDestination(config: Config, assetsMeta: AssetsMeta) {
  // figure out what the path is to the component directory

  if (assetsMeta.originalCollectionPath) {
    // this is from another collection, so reuse the same path it had
    return pathJoin(config, config.collectionDir, COLLECTION_DEPENDENCIES_DIR, assetsMeta.originalCollectionPath);
  }

  return pathJoin(config,
    config.collectionDir,
    config.sys.path.relative(config.srcDir, assetsMeta.absolutePath)
  );
}


export function skipAssetsCopy(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  // always copy assets if it's not a rebuild
  if (!compilerCtx.isRebuild) return false;

  // assume we want to skip copying assets again
  let shouldSkipAssetsCopy = true;

  // loop through each of the changed files
  buildCtx.filesChanged.forEach(changedFile => {
    // get the directory of where the changed file is in
    const changedFileDirPath = normalizePath(config.sys.path.dirname(changedFile));

    // loop through all the possible asset directories
    buildCtx.manifest.modulesFiles.forEach(moduleFile => {
      if (moduleFile.cmpMeta && moduleFile.cmpMeta.assetsDirsMeta) {

        // loop through each of the asset directories of each component
        moduleFile.cmpMeta.assetsDirsMeta.forEach(assetsDir => {
          // get the absolute of the asset directory
          const assetDirPath = normalizePath(assetsDir.absolutePath);

          // if the changed file directory is this asset directory
          // then we should recopy everything over again
          if (changedFileDirPath === assetDirPath) {
            shouldSkipAssetsCopy = false;
            return;
          }
        });

      }
    });

  });

  return shouldSkipAssetsCopy;
}
