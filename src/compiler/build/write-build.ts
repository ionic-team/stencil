import * as d from '@declarations';
import { catchError } from '@utils';
import { generateDistributions } from '../distribution/distribution';
import { writeAppCollections } from '../collections/collection-data';


export async function writeBuildFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort) {
    return;
  }

  // serialize and write the manifest file if need be
  await writeAppCollections(config, compilerCtx, buildCtx);

  const timeSpan = buildCtx.createTimeSpan(`writeBuildFiles started`, true);

  let totalFilesWrote = 0;

  let distributionPromise: Promise<void> = null;

  try {
    // copy www/build to dist/ if generateDistribution is enabled
    distributionPromise = generateDistributions(config, compilerCtx, buildCtx);

    if (!buildCtx.isRebuild) {
      // if this is the initial build then we need to wait on
      // the distributions to finish, otherwise we can let it
      // finish when it finishes
      await distributionPromise;
      distributionPromise = null;
    }

    // commit all the writeFiles, mkdirs, rmdirs and unlinks to disk
    const commitResults = await compilerCtx.fs.commit();

    // get the results from the write to disk commit
    buildCtx.filesWritten = commitResults.filesWritten;
    buildCtx.filesDeleted = commitResults.filesDeleted;
    buildCtx.dirsDeleted = commitResults.dirsDeleted;
    buildCtx.dirsAdded = commitResults.dirsAdded;
    totalFilesWrote = commitResults.filesWritten.length;

    if (buildCtx.isActiveBuild) {
      // successful write
      // kick off writing the cached file stuff
      await compilerCtx.cache.commit();
      buildCtx.debug(`in-memory-fs: ${compilerCtx.fs.getMemoryStats()}`);
      buildCtx.debug(`cache: ${compilerCtx.cache.getMemoryStats()}`);

    } else {
      buildCtx.debug(`commit cache aborted, not active build`);
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`writeBuildFiles finished, files wrote: ${totalFilesWrote}`);

  if (distributionPromise != null) {
    // build didn't need to wait on this finishing
    // let it just do its thing and finish when it gets to it
    distributionPromise.then(() => {
      compilerCtx.fs.commit();
      compilerCtx.cache.commit();
    });
  }
}
