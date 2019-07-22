import * as d from '../../declarations';
import { generateBuildResults } from './build-results';
import { generateBuildStats } from './build-stats';
import { initFsWatcher } from '../fs-watch/fs-watch-init';
import { writeCacheStats } from './cache-stats';


export const buildFinish = async (buildCtx: d.BuildCtx) => {
  const results = await buildDone(buildCtx.config, buildCtx.compilerCtx, buildCtx, false);

  const buildLog: d.BuildLog = {
    buildId: buildCtx.buildId,
    messages: buildCtx.buildMessages.slice(),
    progress: 1
  };
  buildCtx.compilerCtx.events.emit('buildLog', buildLog);

  return results;
};


export const buildAbort = (buildCtx: d.BuildCtx) => {
  return buildDone(buildCtx.config, buildCtx.compilerCtx, buildCtx, true);
};


const buildDone = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, aborted: boolean) => {
  if (buildCtx.hasFinished && buildCtx.buildResults) {
    // we've already marked this build as finished and
    // already created the build results, just return these
    return buildCtx.buildResults;
  }

  buildCtx.debug(`${aborted ? 'aborted' : 'finished'} build, ${buildCtx.timestamp}`);

  // create the build results data
  buildCtx.buildResults = generateBuildResults(config, compilerCtx, buildCtx);

  // log any errors/warnings
  if (!buildCtx.hasFinished) {
    // haven't set this build as finished yet
    if (!buildCtx.hasPrintedResults) {
      config.logger.printDiagnostics(buildCtx.buildResults.diagnostics);
    }

    if (!compilerCtx.hasLoggedServerUrl && config.devServer && config.devServer.browserUrl && config.flags.serve) {
      // we've opened up the dev server
      // let's print out the dev server url
      config.logger.info(`dev server: ${config.logger.cyan(config.devServer.browserUrl)}`);
      compilerCtx.hasLoggedServerUrl = true;
    }

    const hasChanges = buildCtx.hasScriptChanges || buildCtx.hasStyleChanges;
    if (buildCtx.isRebuild && hasChanges && buildCtx.buildResults.hmr && !aborted) {
      // this is a rebuild, and we've got hmr data
      // and this build hasn't been aborted
      logHmr(config.logger, buildCtx);
    }

    // create a nice pretty message stating what happend
    const buildText = buildCtx.isRebuild ? 'rebuild' : 'build';
    const watchText = config.watch ? ', watching for changes...' : '';
    let buildStatus = 'finished';
    let statusColor = 'green';

    if (buildCtx.hasError) {
      // gosh darn, build had errors
      // ಥ_ಥ
      buildStatus = 'failed';
      statusColor = 'red';

    } else {
      // successful build!
      // ┏(°.°)┛ ┗(°.°)┓ ┗(°.°)┛ ┏(°.°)┓
      compilerCtx.hasSuccessfulBuild = true;
    }

    // print out the time it took to build
    // and add the duration to the build results
    if (!buildCtx.hasPrintedResults) {
      buildCtx.timeSpan.finish(`${buildText} ${buildStatus}${watchText}`, statusColor, true, true);
      buildCtx.hasPrintedResults = true;

      // write the build stats
      await generateBuildStats(config, compilerCtx, buildCtx, buildCtx.buildResults);
    }

    // emit a buildFinish event for anyone who cares
    compilerCtx.events.emit('buildFinish', buildCtx.buildResults);

    // write all of our logs to disk if config'd to do so
    // do this even if there are errors or not the active build
    config.logger.writeLogs(buildCtx.isRebuild);

    if (config.watch) {
      // this is a watch build
      // setup watch if we haven't done so already
      await initFsWatcher(config, compilerCtx, buildCtx);

    } else {
      // not a watch build, so lets destroy anything left open
      config.sys.destroy();
    }
  }

  // write cache stats only for memory debugging
  writeCacheStats(config, compilerCtx, buildCtx);

  // it's official, this build has finished
  buildCtx.hasFinished = true;

  return buildCtx.buildResults;
};


const logHmr = (logger: d.Logger, buildCtx: d.BuildCtx) => {
  // this is a rebuild, and we've got hmr data
  // and this build hasn't been aborted
  const hmr = buildCtx.buildResults.hmr;
  if (hmr.componentsUpdated) {
    cleanupUpdateMsg(logger, `updated component`, hmr.componentsUpdated);
  }

  if (hmr.inlineStylesUpdated) {
    const inlineStyles = hmr.inlineStylesUpdated.map(s => s.styleTag).reduce((arr, v) => {
      if (!arr.includes(v)) {
        arr.push(v);
      }
      return arr;
    }, [] as string[]);
    cleanupUpdateMsg(logger, `updated style`, inlineStyles);
  }

  if (hmr.externalStylesUpdated) {
    cleanupUpdateMsg(logger, `updated stylesheet`, hmr.externalStylesUpdated);
  }

  if (hmr.imagesUpdated) {
    cleanupUpdateMsg(logger, `updated image`, hmr.imagesUpdated);
  }
};


const cleanupUpdateMsg = (logger: d.Logger, msg: string, fileNames: string[]) => {
  if (fileNames.length > 0) {
    let fileMsg = '';

    if (fileNames.length > 7) {
      const remaining = fileNames.length - 6;
      fileNames = fileNames.slice(0, 6);
      fileMsg = fileNames.join(', ') + `, +${remaining} others`;

    } else {
      fileMsg = fileNames.join(', ');
    }

    if (fileNames.length > 1) {
      msg += 's';
    }

    logger.info(`${msg}: ${logger.cyan(fileMsg)}`);
  }
};
