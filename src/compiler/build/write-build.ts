import type * as d from '../../declarations';
import { catchError, getStencilCompilerContext } from '@utils';
import { outputServiceWorkers } from '../output-targets/output-service-workers';
import { validateBuildFiles } from './validate-files';

export const writeBuild = async (config: d.Config, buildCtx: d.BuildCtx) => {
  const timeSpan = buildCtx.createTimeSpan(`writeBuildFiles started`, true);

  let totalFilesWrote = 0;

  try {
    // commit all the writeFiles, mkdirs, rmdirs and unlinks to disk
    const commitResults = await getStencilCompilerContext().fs.commit();

    // get the results from the write to disk commit
    buildCtx.filesWritten = commitResults.filesWritten;
    buildCtx.filesDeleted = commitResults.filesDeleted;
    buildCtx.dirsDeleted = commitResults.dirsDeleted;
    buildCtx.dirsAdded = commitResults.dirsAdded;
    totalFilesWrote = commitResults.filesWritten.length;

    // successful write
    // kick off writing the cached file stuff
    // await getStencilCompilerContext().cache.commit();
    buildCtx.debug(`in-memory-fs: ${getStencilCompilerContext().fs.getMemoryStats()}`);
    // buildCtx.debug(`cache: ${getStencilCompilerContext().cache.getMemoryStats()}`);

    await outputServiceWorkers(config, buildCtx), await validateBuildFiles(config, buildCtx);
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`writeBuildFiles finished, files wrote: ${totalFilesWrote}`);
};
