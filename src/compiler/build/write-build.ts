import { BuildCtx, CompilerCtx, Config } from '../../declarations';
import { catchError } from '../util';
import { copyComponentAssets } from '../copy/copy-assets';
import { generateDistribution } from './distribution';
import { generateServiceWorker } from '../service-worker/generate-sw';
import { writeAppCollection } from '../collections/collection-data';


export async function writeBuildFiles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  // serialize and write the manifest file if need be
  await writeAppCollection(config, compilerCtx, buildCtx);

  const timeSpan = config.logger.createTimeSpan(`writeBuildFiles started`, true);

  // kick off copying component assets
  // and copy www/build to dist/ if generateDistribution is enabled
  await Promise.all([
    copyComponentAssets(config, compilerCtx, buildCtx),
    generateDistribution(config, compilerCtx, buildCtx)
  ]);

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

    // generate the service worker
    await generateServiceWorker(config, compilerCtx, buildCtx);

    config.logger.debug(`in-memory-fs: ${compilerCtx.fs.getMemoryStats()}`);
    config.logger.debug(`cache: ${compilerCtx.cache.getMemoryStats()}`);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`writeBuildFiles finished, files wrote: ${totalFilesWrote}`);
}


export async function emptyDestDir(config: Config, compilerCtx: CompilerCtx) {
  if (compilerCtx.isRebuild) {
    // only empty the directories on the first build
    return;
  }

  // empty promises :(
  const emptyPromises: Promise<any>[] = [];

  if (config.generateWWW && config.emptyWWW) {
    config.logger.debug(`empty wwwDir: ${config.wwwDir}`);
    emptyPromises.push(compilerCtx.fs.emptyDir(config.wwwDir));
  }

  if (config.generateDistribution && config.emptyDist) {
    config.logger.debug(`empty distDir: ${config.distDir}`);
    emptyPromises.push(compilerCtx.fs.emptyDir(config.distDir));
  }

  // let's empty out the build dest directory
  await Promise.all(emptyPromises);
}
