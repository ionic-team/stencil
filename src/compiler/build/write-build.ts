import { BuildCtx, CompilerCtx, Config } from '../../declarations';
import { catchError } from '../util';
import { copyComponentAssets } from '../component-plugins/assets-plugin';
import { generateDistribution } from './distribution';
import { writeAppManifest } from '../manifest/manifest-data';


export async function writeBuildFiles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  // serialize and write the manifest file if need be
  await writeAppManifest(config, compilerCtx, buildCtx);

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

    // build a list of all the components used
    buildCtx.manifest.bundles.forEach(b => {
      b.components.forEach(c => buildCtx.components.push(c));
    });
    buildCtx.components.sort();

    // successful write
    // kick off writing the cached file stuff
    // no need to wait on it finishing
    compilerCtx.cache.commit();

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
    config.logger.debug(`empty buildDir: ${config.buildDir}`);
    emptyPromises.push(compilerCtx.fs.emptyDir(config.buildDir));
  }

  if (config.generateDistribution && config.emptyDist) {
    config.logger.debug(`empty distDir: ${config.distDir}`);
    emptyPromises.push(compilerCtx.fs.emptyDir(config.distDir));
  }
  // let's empty out the build dest directory
  await Promise.all(emptyPromises);

  await compilerCtx.fs.commit();
}
