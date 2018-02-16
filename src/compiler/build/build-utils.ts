import { BuildCtx, CompilerCtx, Config, WatcherResults } from '../../declarations';
import { catchError, hasError } from '../util';
import { generateBuildResults, generateBuildStats } from './build-results';
import { initWatcher } from '../watcher/watcher-init';


export function getBuildContext(config: Config, compilerCtx: CompilerCtx, watcher: WatcherResults) {
  // do a full build if there is no watcher
  // or the watcher said the config has updated
  // or we've never had a successful build yet
  const requiresFullBuild = !watcher || watcher.configUpdated || !compilerCtx.hasSuccessfulBuild;

  const isRebuild = !!watcher;
  compilerCtx.isRebuild = isRebuild;

  const msg = `${isRebuild ? 'rebuild' : 'build'}, ${config.fsNamespace}, ${config.devMode ? 'dev' : 'prod'} mode, started`;

  // increment the active build id
  compilerCtx.activeBuildId++;

  // data for one build
  const buildCtx: BuildCtx = {
    requiresFullBuild: requiresFullBuild,
    buildId: compilerCtx.activeBuildId,
    componentRefs: [],
    collections: [],
    moduleGraphs: [],
    diagnostics: [],
    entryPoints: [],
    entryModules: [],
    components: [],
    data: {},
    transpileBuildCount: 0,
    bundleBuildCount: 0,
    appFileBuildCount: 0,
    indexBuildCount: 0,
    aborted: false,
    startTime: Date.now(),
    timeSpan: config.logger.createTimeSpan(msg),
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

  buildCtx.finish = async () => {
    try {
      // setup watcher if need be
      initWatcher(config, compilerCtx);
    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }

    return finishBuild(config, compilerCtx, buildCtx);
  };

  if (watcher) {
    Object.keys(watcher).forEach(key => {
      (watcher as any)[key] = {};
    });
  }

  return buildCtx;
}


async function finishBuild(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  const buildResults = generateBuildResults(config, compilerCtx, buildCtx);

  // log any errors/warnings
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
    compilerCtx.hasSuccessfulBuild = true;
    compilerCtx.lastBuildHadError = false;
  }

  // print out the time it took to build
  // and add the duration to the build results
  buildCtx.timeSpan.finish(`${buildText} ${buildStatus}${watchText}`, statusColor, bold, true);

  // write the build stats
  await generateBuildStats(config, compilerCtx, buildCtx, buildResults);

  // clear it all out for good measure
  for (const k in buildCtx) {
    (buildCtx as any)[k] = null;
  }

  // write all of our logs to disk if config'd to do so
  config.logger.writeLogs(compilerCtx.isRebuild);

  // emit a build event, which happens for inital build and rebuilds
  compilerCtx.events.emit('build', buildResults);

  if (compilerCtx.isRebuild) {
    // emit a rebuild event, which happens only for rebuilds
    compilerCtx.events.emit('rebuild', buildResults);
  }

  return buildResults;
}


function shouldAbort(ctx: CompilerCtx, buildCtx: BuildCtx) {
  if (ctx.activeBuildId > buildCtx.buildId || buildCtx.aborted) {
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
