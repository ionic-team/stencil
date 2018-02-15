import { AssetsMeta, BuildCtx, CompilerCtx, Config, CopyTask } from '../../declarations';
import { catchError, normalizePath, pathJoin } from '../util';
import { COLLECTION_DEPENDENCIES_DIR } from '../collections/collection-data';
import { getAppDistDir, getAppWWWBuildDir } from '../app/app-file-naming';


export async function copyComponentAssets(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {

  if (canSkipAssetsCopy(config, compilerCtx, buildCtx)) {
    // no need to recopy all assets again
    return;
  }

  config.logger.debug(`copy assets`);

  try {
    // get a list of all the directories to copy
    // these paths should be absolute
    const copyToBuildDir: AssetsMeta[] = [];
    const copyToCollectionDir: AssetsMeta[] = [];
    const copyTasks: CopyTask[] = [];

    buildCtx.entryModules.forEach(entryModule => {
      const moduleFiles = entryModule.moduleFiles.filter(m => {
        return m.cmpMeta.assetsDirsMeta && m.cmpMeta.assetsDirsMeta.length;
      });

      moduleFiles.forEach(moduleFile => {
        moduleFile.cmpMeta.assetsDirsMeta.forEach(assetsMeta => {
          copyToBuildDir.push(assetsMeta);

          if (!moduleFile.excludeFromCollection) {
            copyToCollectionDir.push(assetsMeta);
          }
        });
      });
    });

    // copy all of the files in asset directories to the app's build and/or dist directory
    copyToBuildDir.forEach(assetsMeta => {
      // figure out what the path is to the component directory
      if (config.generateWWW) {
        const wwwBuildDirDestination = pathJoin(config, getAppWWWBuildDir(config), assetsMeta.cmpRelativePath);

        copyTasks.push({
          src: assetsMeta.absolutePath,
          dest: wwwBuildDirDestination
        });
      }

      if (config.generateDistribution) {
        const distDirDestination = pathJoin(config, getAppDistDir(config), assetsMeta.cmpRelativePath);

        copyTasks.push({
          src: assetsMeta.absolutePath,
          dest: distDirDestination
        });
      }
    });


    // copy all of the files in asset directories to the dist/collection directory
    // but only do this copy when the generateCollection flag is set to true
    if (config.generateDistribution) {

      // copy all of the files in asset directories to the app's collection directory
      copyToCollectionDir.forEach(assetsMeta => {
        // figure out what the path is to the component directory
        const collectionDirDestination = getCollectionDirDestination(config, assetsMeta);

        copyTasks.push({
          src: assetsMeta.absolutePath,
          dest: collectionDirDestination
        });
      });
    }

    // queue up all the asset copy tasks
    await Promise.all(copyTasks.map(async copyTask => {
      await compilerCtx.fs.copy(copyTask.src, copyTask.dest);
    }));

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
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


export function canSkipAssetsCopy(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  if (!compilerCtx.hasSuccessfulBuild) {
    // always copy assets if we haven't had a successful build yet
    // cannot skip build
    return false;
  }

  // assume we want to skip copying assets again
  let shouldSkipAssetsCopy = true;

  // loop through each of the changed files
  buildCtx.filesChanged.forEach(changedFile => {
    // get the directory of where the changed file is in
    const changedFileDirPath = normalizePath(config.sys.path.dirname(changedFile));

    // loop through all the possible asset directories
    buildCtx.entryModules.forEach(entryModule => {
      entryModule.moduleFiles.forEach(moduleFile => {
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

  });

  return shouldSkipAssetsCopy;
}
