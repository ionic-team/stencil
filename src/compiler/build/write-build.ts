import type * as d from '../../declarations';
import { catchError } from '@utils';
import { outputServiceWorkers } from '../output-targets/output-service-workers';
import { validateBuildFiles } from './validate-files';

/**
 * Writes files to disk as a result of compilation
 * @param config the Stencil configuration used for the build
 * @param compilerCtx the compiler context associated with the build
 * @param buildCtx the build context associated with the current build
 */
export const writeBuild = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx
): Promise<void> => {
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
    buildCtx.debug(`in-memory-fs: ${compilerCtx.fs.getMemoryStats()}`);

    await outputServiceWorkers(config, buildCtx);
    await validateBuildFiles(config, compilerCtx, buildCtx);
  } catch (e: any) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`writeBuildFiles finished, files wrote: ${totalFilesWrote}`);
};
