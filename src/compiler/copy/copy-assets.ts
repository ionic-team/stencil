import * as d from '../../declarations';
import { catchError, normalizePath, pathJoin } from '../util';
import { getAppBuildDir } from '../app/app-file-naming';


export async function copyComponentAssets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {

  if (canSkipAssetsCopy(config, compilerCtx, buildCtx)) {
    // no need to recopy all assets again
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(outputTarget => {
    return outputTarget.type === 'www' || outputTarget.type === 'dist';
  });

  config.logger.debug(`copy assets`);

  try {
    // get a list of all the directories to copy
    // these paths should be absolute
    const copyToBuildDir: d.AssetsMeta[] = [];
    const copyToCollectionDir: d.AssetsMeta[] = [];
    const copyTasks: d.CopyTask[] = [];

    buildCtx.entryModules.forEach(entryModule => {
      const moduleFiles = entryModule.moduleFiles.filter(m => {
        return m.cmpMeta.assetsDirsMeta && m.cmpMeta.assetsDirsMeta.length;
      });

      moduleFiles.forEach(moduleFile => {
        moduleFile.cmpMeta.assetsDirsMeta.forEach(assetsMeta => {
          copyToBuildDir.push(assetsMeta);

          if (!moduleFile.excludeFromCollection && !moduleFile.isCollectionDependency) {
            copyToCollectionDir.push(assetsMeta);
          }
        });
      });
    });

    // copy all of the files in asset directories to the app's build and/or dist directory
    copyToBuildDir.forEach(assetsMeta => {
      // figure out what the path is to the component directory

      outputTargets.forEach(outputTarget => {
        const buildDirDestination = pathJoin(config, getAppBuildDir(config, outputTarget), assetsMeta.cmpRelativePath);

        copyTasks.push({
          src: assetsMeta.absolutePath,
          dest: buildDirDestination
        });
      });
    });


    outputTargets.forEach(outputTarget => {
      if (outputTarget.collectionDir) {
        // copy all of the files in asset directories to the app's collection directory
        copyToCollectionDir.forEach(assetsMeta => {
          // figure out what the path is to the component directory
          const collectionDirDestination = pathJoin(config,
            outputTarget.collectionDir,
            config.sys.path.relative(config.srcDir, assetsMeta.absolutePath)
          );

          copyTasks.push({
            src: assetsMeta.absolutePath,
            dest: collectionDirDestination
          });
        });
      }
    });

    // queue up all the asset copy tasks
    await Promise.all(copyTasks.map(copyTask => {
      return compilerCtx.fs.copy(copyTask.src, copyTask.dest);
    }));

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}



export function canSkipAssetsCopy(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
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
