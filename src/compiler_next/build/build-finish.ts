import * as d from '../../declarations';
import { generateBuildResults } from './build-results';
import { IS_NODE_ENV } from '@utils';
import path from 'path';

export const buildFinish = async (buildCtx: d.BuildCtx) => {
  const results = await buildDone(buildCtx.config, buildCtx.compilerCtx, buildCtx, false);

  const buildLog: d.BuildLog = {
    buildId: buildCtx.buildId,
    messages: buildCtx.buildMessages.slice(),
    progress: 1,
  };
  buildCtx.compilerCtx.events.emit('buildLog', buildLog);

  return results;
};

export const buildAbort = (buildCtx: d.BuildCtx) => {
  return buildDone(buildCtx.config, buildCtx.compilerCtx, buildCtx, true);
};

const buildDone = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, aborted: boolean) => {
  if (buildCtx.hasFinished && buildCtx.buildResults_next) {
    // we've already marked this build as finished and
    // already created the build results, just return these
    return buildCtx.buildResults_next;
  }

  buildCtx.debug(`${aborted ? 'aborted' : 'finished'} build, ${buildCtx.timestamp}`);

  // create the build results data
  buildCtx.buildResults_next = generateBuildResults(config, compilerCtx, buildCtx);

  // log any errors/warnings
  if (!buildCtx.hasFinished) {
    // haven't set this build as finished yet
    if (!buildCtx.hasPrintedResults) {
      cleanDiagnostics(config, buildCtx.buildResults_next.diagnostics);
      config.logger.printDiagnostics(buildCtx.buildResults_next.diagnostics);
    }

    const hasChanges = buildCtx.hasScriptChanges || buildCtx.hasStyleChanges;
    if (buildCtx.isRebuild && hasChanges && buildCtx.buildResults_next.hmr && !aborted) {
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
      compilerCtx.changedFiles.clear();
      compilerCtx.hasSuccessfulBuild = true;
      buildCtx.buildResults_next.hasSuccessfulBuild = true;
    }

    // print out the time it took to build
    // and add the duration to the build results
    if (!buildCtx.hasPrintedResults) {
      buildCtx.timeSpan.finish(`${buildText} ${buildStatus}${watchText}`, statusColor, true, true);
      buildCtx.hasPrintedResults = true;
    }

    // emit a buildFinish event for anyone who cares
    compilerCtx.events.emit('buildFinish', buildCtx.buildResults_next);

    // write all of our logs to disk if config'd to do so
    // do this even if there are errors or not the active build
    config.logger.writeLogs(buildCtx.isRebuild);
  }

  // it's official, this build has finished
  buildCtx.hasFinished = true;

  if (!config.watch) {
    compilerCtx.reset();
    if (IS_NODE_ENV && global.gc) {
      buildCtx.debug(`triggering forced gc`);
      global.gc();
      buildCtx.debug(`forced gc finished`);
    }
  }

  return buildCtx.buildResults_next;
};

const logHmr = (logger: d.Logger, buildCtx: d.BuildCtx) => {
  // this is a rebuild, and we've got hmr data
  // and this build hasn't been aborted
  const hmr = buildCtx.buildResults_next.hmr;
  if (hmr.componentsUpdated) {
    cleanupUpdateMsg(logger, `updated component`, hmr.componentsUpdated);
  }

  if (hmr.inlineStylesUpdated) {
    const inlineStyles = hmr.inlineStylesUpdated
      .map(s => s.styleTag)
      .reduce((arr, v) => {
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

const cleanDiagnostics = (config: d.Config, diagnostics: d.Diagnostic[]) => {
  diagnostics.forEach(diagnostic => {
    if (!diagnostic.relFilePath && diagnostic.absFilePath && config.rootDir) {
      diagnostic.relFilePath = path.relative(config.rootDir, diagnostic.absFilePath);
    }
  });
};
