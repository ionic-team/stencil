import * as d from '@declarations';
import { normalizePath } from '@utils';
import { sys } from '@sys';


export function getComponentAssetsCopyTasks(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filesChanged: string[]) {
  const copyTasks: d.CopyTask[] = [];

  if (canSkipAssetsCopy(compilerCtx, buildCtx.entryModules, filesChanged)) {
    // no need to recopy all assets again
    return copyTasks;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(outputTarget => {
    return outputTarget.appBuild;
  });

  if (outputTargets.length === 0) {
    return copyTasks;
  }

  // get a list of all the directories to copy
  // these paths should be absolute
  const copyToBuildDir: d.AssetsMeta[] = [];
  const copyToCollectionDir: d.AssetsMeta[] = [];

  buildCtx.entryModules.forEach(entryModule => {
    const cmps = entryModule.cmps.filter(cmp => {
      return cmp.assetsDirs != null && cmp.assetsDirs.length > 0;
    });

    cmps.forEach(cmp => {
      cmp.assetsDirs.forEach(assetsMeta => {
        copyToBuildDir.push(assetsMeta);

        if (!cmp.excludeFromCollection && !cmp.isCollectionDependency) {
          copyToCollectionDir.push(assetsMeta);
        }
      });
    });
  });

  // copy all of the files in asset directories to the app's build and/or dist directory
  copyToBuildDir.forEach(assetsMeta => {
    // figure out what the path is to the component directory

    outputTargets.forEach(outputTarget => {
      const buildDirDestination = sys.path.join(outputTarget.buildDir, config.fsNamespace, assetsMeta.cmpRelativePath);

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
        const collectionDirDestination = sys.path.join(
          outputTarget.collectionDir,
          sys.path.relative(config.srcDir, assetsMeta.absolutePath)
        );

        copyTasks.push({
          src: assetsMeta.absolutePath,
          dest: collectionDirDestination
        });
      });
    }
  });

  buildCtx.debug(`getComponentAssetsCopyTasks: ${copyTasks.length}`);

  return copyTasks;
}


export function canSkipAssetsCopy(compilerCtx: d.CompilerCtx, entryModules: d.EntryModule[], filesChanged: string[]) {
  if (!compilerCtx.hasSuccessfulBuild) {
    // always copy assets if we haven't had a successful build yet
    // cannot skip build
    return false;
  }

  // assume we want to skip copying assets again
  let shouldSkipAssetsCopy = true;

  // loop through each of the changed files
  filesChanged.forEach(changedFile => {
    // get the directory of where the changed file is in
    const changedFileDirPath = normalizePath(sys.path.dirname(changedFile));

    // loop through all the possible asset directories
    entryModules.forEach(entryModule => {
      entryModule.cmps.forEach(cmp => {
        if (cmp.assetsDirs != null) {

          // loop through each of the asset directories of each component
          cmp.assetsDirs.forEach(assetsDir => {
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
