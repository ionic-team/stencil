import * as d from '../../declarations';
import { catchError } from '../util';
import { generateDistributions } from '../distribution/distribution';
import { writeAppCollections } from '../collections/collection-data';


export async function writeBuildFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort()) {
    return;
  }

  // serialize and write the manifest file if need be
  await writeAppCollections(config, compilerCtx, buildCtx);

  const timeSpan = buildCtx.createTimeSpan(`writeBuildFiles started`, true);

  // copy www/build to dist/ if generateDistribution is enabled
  await generateDistributions(config, compilerCtx, buildCtx);

  let totalFilesWrote = 0;

  try {
    // commit all the writeFiles, mkdirs, rmdirs and unlinks to disk
    const commitResults = await compilerCtx.fs.commit();

    // get the results from the write to disk commit
    buildCtx.filesWritten = commitResults.filesWritten;
    buildCtx.filesDeleted = commitResults.filesDeleted;
    buildCtx.dirsDeleted = commitResults.dirsDeleted;
    buildCtx.dirsAdded = commitResults.dirsAdded;
    totalFilesWrote = commitResults.filesWritten.length;

    // successful write
    // kick off writing the cached file stuff
    // no need to wait on it finishing
    compilerCtx.cache.commit();

    config.logger.debug(`in-memory-fs: ${compilerCtx.fs.getMemoryStats()}`);
    config.logger.debug(`cache: ${compilerCtx.cache.getMemoryStats()}`);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`writeBuildFiles finished, files wrote: ${totalFilesWrote}`);
}
