import * as d from '../../declarations';
import { catchError } from '@utils';
import { outputServiceWorkers } from '../output-targets/output-service-workers';
import { validateBuildFiles } from './validate-files';

export const writeBuild = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const timeSpan = buildCtx.createTimeSpan(`writeBuildFiles started`, true);

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
    // await compilerCtx.cache.commit();
    buildCtx.debug(`in-memory-fs: ${compilerCtx.fs.getMemoryStats()}`);
    // buildCtx.debug(`cache: ${compilerCtx.cache.getMemoryStats()}`);

    await outputServiceWorkers(config, buildCtx), await validateBuildFiles(config, compilerCtx, buildCtx);
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`writeBuildFiles finished, files wrote: ${totalFilesWrote}`);
};
