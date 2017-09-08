import { BuildConfig, BuildContext, BuildResults } from '../../util/interfaces';
import { catchError, writeFiles } from '../util';
import { copyComponentAssets } from '../component-plugins/assets-plugin';
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

  // 1) empty the destination directory
  // 2) write all of the files
  // 3) copy all of the assets
  // not doing write and copy at the same time incase they
  // both try to create the same directory at the same time
  return emptyDestDir(config, ctx).then(() => {
    // kick off writing files
    return writeFiles(config.sys, config.rootDir, filesToWrite).catch(err => {
      catchError(ctx.diagnostics, err);
    });

  }).then(() => {
    // kick off copying component assets
    return copyComponentAssets(config, ctx);

  }).then(() => {
    timeSpan.finish(`writePhase finished`);
  });
}


function emptyDestDir(config: BuildConfig, ctx: BuildContext) {
  if (ctx.isRebuild) {
    // don't bother emptying the directories when it's a rebuild
    return Promise.resolve([]);
  }

  config.logger.debug(`empty buildDir: ${config.buildDir}`);

  // empty promises :(
  const emptyPromises = [
    config.sys.emptyDir(config.buildDir)
  ];

  if (config.generateCollection) {
    config.logger.debug(`empty collectionDir: ${config.collectionDir}`);
    emptyPromises.push(config.sys.emptyDir(config.collectionDir));
  }

  // let's empty out the build dest directory
  return Promise.all(emptyPromises);
}
