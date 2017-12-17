import { BuildConfig, BuildContext, BuildResults } from '../../util/interfaces';
import { catchError, writeFiles } from '../util';
import { copyComponentAssets } from '../component-plugins/assets-plugin';
import { generateDistribution } from './distribution';
import { writeAppManifest } from '../manifest/manifest-data';


export function writeBuildFiles(config: BuildConfig, ctx: BuildContext, buildResults: BuildResults) {
  // serialize and write the manifest file if need be
  writeAppManifest(config, ctx, buildResults);

  buildResults.files = Object.keys(ctx.filesToWrite).sort();
  const totalFilesToWrite = buildResults.files.length;

  const timeSpan = config.logger.createTimeSpan(`writePhase started, fileUpdates: ${totalFilesToWrite}`, true);

  // create a copy of all the files to write
  const filesToWrite = Object.assign({}, ctx.filesToWrite);

  // clear out the files to write object for the next build
  ctx.filesToWrite = {};

  // 1) destination directory has already been emptied earlier in the build
  // 2) write all of the files
  // 3) copy all of the assets
  // not doing write and copy at the same time incase they
  // both try to create the same directory at the same time
  return writeFiles(config.sys, config.rootDir, filesToWrite).catch(err => {
    catchError(ctx.diagnostics, err);

  }).then(() => {
    // kick off copying component assets
    // and copy www/build to dist/ if generateDistribution is enabled
    return Promise.all([
      copyComponentAssets(config, ctx),
      generateDistribution(config, ctx)
    ]);

  }).then(() => {
    timeSpan.finish(`writePhase finished`);
  });
}


export function emptyDestDir(config: BuildConfig, ctx: BuildContext) {
  // empty promises :(
  const emptyPromises: Promise<any>[] = [];

  if (!ctx.isRebuild) {
    // don't bother emptying the directories when it's a rebuild

    if (config.generateWWW && config.emptyWWW) {
      config.logger.debug(`empty buildDir: ${config.buildDir}`);
      emptyPromises.push(config.sys.emptyDir(config.buildDir));
    }

    if (config.generateDistribution && config.emptyDist) {
      config.logger.debug(`empty distDir: ${config.distDir}`);
      emptyPromises.push(config.sys.emptyDir(config.distDir));
    }

  }

  // let's empty out the build dest directory
  return Promise.all(emptyPromises);
}
