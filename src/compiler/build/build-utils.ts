import { BuildCtx, BuildResults, CompilerCtx, Config, WatcherResults } from '../../util/interfaces';
import { catchError, hasError } from '../util';
import { cleanDiagnostics } from '../../util/logger/logger-util';
import { initWatcher } from '../watcher/watcher-init';


export function getBuildContext(config: Config, compilerCtx: CompilerCtx, watcher: WatcherResults) {
  // do a full build if there is no watcher
  // or the watcher said the config has updated
  const requiresFullBuild = !watcher || watcher.configUpdated;

  const isRebuild = !!watcher;
  compilerCtx.isRebuild = isRebuild;

  const msg = `${isRebuild ? 'rebuild' : 'build'}, ${config.fsNamespace}, ${config.devMode ? 'dev' : 'prod'} mode, started`;

  // increment the active build id
  compilerCtx.activeBuildId++;

  // data for one build
  const buildCtx: BuildCtx = {
    requiresFullBuild: requiresFullBuild,
    buildId: compilerCtx.activeBuildId,
    diagnostics: [],
    manifest: {},
    transpileBuildCount: 0,
    bundleBuildCount: 0,
    appFileBuildCount: 0,
    indexBuildCount: 0,
    aborted: false,
    startTime: Date.now(),
    timeSpan: config.logger.createTimeSpan(msg),
    components: [],
    hasChangedJsText: false,
    filesWritten: [],
    filesChanged: watcher ? watcher.filesChanged : [],
    filesUpdated: watcher ? watcher.filesUpdated : [],
    filesAdded: watcher ? watcher.filesAdded : [],
    filesDeleted: watcher ? watcher.filesDeleted : [],
    dirsDeleted: watcher ? watcher.dirsDeleted : [],
    dirsAdded: watcher ? watcher.dirsAdded : []
  };

  buildCtx.shouldAbort = () => {
    return shouldAbort(compilerCtx, buildCtx);
  };

  buildCtx.finish = () => {
    try {
      // setup watcher if need be
      initWatcher(config, compilerCtx, buildCtx);
    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }

    return finishBuild(config, compilerCtx, buildCtx);
  };

  return buildCtx;
}


function finishBuild(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  const buildResults = generateBuildResults(config, compilerCtx, buildCtx);

  // print print any errors/warnings
  config.logger.printDiagnostics(buildResults.diagnostics);

  // create a nice pretty message stating what happend
  const buildText = compilerCtx.isRebuild ? 'rebuild' : 'build';
  let watchText = config.watch ? ', watching for changes...' : '';
  let buildStatus = 'finished';
  let statusColor = 'green';
  let bold = true;

  if (buildResults.hasError) {
    compilerCtx.lastBuildHadError = true;
    buildStatus = 'failed';
    statusColor = 'red';

  } else if (buildResults.aborted) {
    buildStatus = 'aborted';
    watchText = '';
    statusColor = 'dim';
    bold = false;

  } else {
    compilerCtx.lastBuildHadError = false;
  }

  // print out the time it took to build
  // and add the duration to the build results
  buildCtx.timeSpan.finish(`${buildText} ${buildStatus}${watchText}`, statusColor, bold, true);

  // emit a build event, which happens for inital build and rebuilds
  compilerCtx.events.emit('build', buildResults);

  if (compilerCtx.isRebuild) {
    // emit a rebuild event, which happens only for rebuilds
    compilerCtx.events.emit('rebuild', buildResults);
  }

  return buildResults;
}


function generateBuildResults(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  // create the build results that get returned
  const buildResults: BuildResults = {
    buildId: buildCtx.buildId,
    diagnostics: cleanDiagnostics(buildCtx.diagnostics),
    hasError: hasError(buildCtx.diagnostics),
    aborted: buildCtx.aborted
  };

  // only bother adding the buildStats config is enabled
  // useful for testing/debugging
  if (config.buildStats) {
    generateBuildResultsStats(compilerCtx, buildCtx, buildResults);
  }

  return buildResults;
}


function generateBuildResultsStats(compilerCtx: CompilerCtx, buildCtx: BuildCtx, buildResults: BuildResults) {
  // stuff on the right are internal property names
  // stuff set on the left is public and should not be refactored
  buildResults.stats = {
    duration: Date.now() - buildCtx.startTime,
    isRebuild: compilerCtx.isRebuild,
    components: buildCtx.components,
    transpileBuildCount: buildCtx.transpileBuildCount,
    bundleBuildCount: buildCtx.bundleBuildCount,
    hasChangedJsText: buildCtx.hasChangedJsText,
    filesWritten: buildCtx.filesWritten.sort(),
    filesChanged: buildCtx.filesChanged.slice().sort(),
    filesUpdated: buildCtx.filesUpdated.slice().sort(),
    filesAdded: buildCtx.filesAdded.slice().sort(),
    filesDeleted: buildCtx.filesDeleted.slice().sort(),
    dirsAdded: buildCtx.dirsAdded.slice().sort(),
    dirsDeleted: buildCtx.dirsDeleted.slice().sort()
  };
}


function shouldAbort(ctx: CompilerCtx, buildCtx: BuildCtx) {
  if (ctx.activeBuildId > buildCtx.buildId) {
    buildCtx.aborted = true;
    return true;
  }

  if (hasError(buildCtx.diagnostics)) {
    // remember if the last build had an error or not
    // this is useful if the next build should do a full build or not
    ctx.lastBuildHadError = true;

    buildCtx.aborted = true;
    return true;
  }

  return false;
}
