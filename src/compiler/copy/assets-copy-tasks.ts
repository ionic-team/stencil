import * as d from '@declarations';
import { normalizePath } from '@utils';
import { sys } from '@sys';

export function getComponentAssetsCopyTasks(buildCtx: d.BuildCtx, dest: string, allAssets: boolean) {
  if (buildCtx.skipAssetsCopy) {
    return [];
  }

  // get a list of all the directories to copy
  // these paths should be absolute
  const copyTasks: d.CopyTask[] = [];

  buildCtx.entryModules.forEach(entryModule => {
    entryModule.cmps.forEach(cmp => {
      if (
        (cmp.assetsDirs != null && cmp.assetsDirs.length > 0) &&
        (allAssets || (!cmp.excludeFromCollection && !cmp.isCollectionDependency))) {

        cmp.assetsDirs.forEach(assetsMeta => {
          copyTasks.push({
            src: assetsMeta.absolutePath,
            dest: sys.path.join(dest, assetsMeta.cmpRelativePath)
          });
        });
      }
    });
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
