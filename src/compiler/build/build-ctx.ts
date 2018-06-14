import * as d from '../../declarations';
import { catchError, hasError } from '../util';
import { generateBuildResults } from './build-results';
import { generateBuildStats } from './build-stats';
import { initWatcher } from '../watcher/watcher-init';


export class BuildContext implements d.BuildCtx {
  aborted = false;
  appFileBuildCount = 0;
  buildId = -1;
  buildResults: d.BuildResults = null;
  bundleBuildCount = 0;
  collections: d.Collection[] = [];
  components: string[] = [];
  data: any = {};
  diagnostics: d.Diagnostic[] = [];
  dirsAdded: string[] = [];
  dirsDeleted: string[] = [];
  entryModules: d.EntryModule[] = [];
  entryPoints: d.EntryPoint[] = [];
  filesAdded: string[] = [];
  filesChanged: string[] = [];
  filesDeleted: string[] = [];
  filesUpdated: string[] = [];
  filesWritten: string[] = [];
  global: d.ModuleFile = null;
  graphData: d.GraphData = null;
  hasFinished = false;
  hasLoggedFinish = false;
  hasSlot: boolean = null;
  hasSvg: boolean = null;
  indexBuildCount = 0;
  isRebuild = false;
  requiresFullBuild = true;
  startTime = Date.now();
  timeSpan: d.LoggerTimeSpan = null;
  transpileBuildCount = 0;
  validateTypesPromise: Promise<d.Diagnostic[]>;

  constructor(private config: d.Config, private compilerCtx: d.CompilerCtx, watcher: d.WatcherResults) {
    // do a full build if there is no watcher
    // or the watcher said the config has updated
    // or we've never had a successful build yet
    this.requiresFullBuild = !watcher || watcher.configUpdated || !compilerCtx.hasSuccessfulBuild;

    this.isRebuild = !!watcher;
    compilerCtx.isRebuild = this.isRebuild;

    const msg = `${this.isRebuild ? 'rebuild' : 'build'}, ${config.fsNamespace}, ${config.devMode ? 'dev' : 'prod'} mode, started`;
    this.timeSpan = config.logger.createTimeSpan(msg);

    // increment the active build id
    compilerCtx.activeBuildId++;
    this.buildId = compilerCtx.activeBuildId;

    if (watcher) {
      this.filesChanged.push(...watcher.filesChanged);
      this.filesUpdated.push(...watcher.filesUpdated);
      this.filesAdded.push(...watcher.filesAdded);
      this.filesDeleted.push(...watcher.filesDeleted);
      this.dirsDeleted.push(...watcher.dirsDeleted);
      this.dirsAdded.push(...watcher.dirsAdded);

      Object.keys(watcher).forEach(key => {
        (watcher as any)[key] = {};
      });
    }
  }

  createTimeSpan(msg: string, debug?: boolean) {
    if (!this.hasLoggedFinish || debug) {
      const timeSpan = this.config.logger.createTimeSpan(msg, debug);

      return {
        finish: (msg: string) => {
          if (!this.hasLoggedFinish || debug) {
            timeSpan.finish(msg);
          }
        }
      };
    }

    return {
      finish: () => {/**/}
    };
  }

  async finish() {
    try {
      // setup watcher if need be
      initWatcher(this.config, this.compilerCtx);
    } catch (e) {
      catchError(this.diagnostics, e);
    }

    if (this.hasFinished && this.buildResults) {
      return this.buildResults;
    }

    this.buildResults = await generateBuildResults(this.config, this.compilerCtx, this as any);

    // log any errors/warnings
    if (!this.hasLoggedFinish) {
      this.hasLoggedFinish = true;
      this.config.logger.printDiagnostics(this.buildResults.diagnostics);

      // create a nice pretty message stating what happend
      const buildText = this.isRebuild ? 'rebuild' : 'build';
      let watchText = this.config.watch ? ', watching for changes...' : '';
      let buildStatus = 'finished';
      let statusColor = 'green';
      let bold = true;

      if (this.buildResults.hasError) {
        this.compilerCtx.lastBuildHadError = true;
        buildStatus = 'failed';
        statusColor = 'red';

      } else if (this.buildResults.aborted) {
        buildStatus = 'aborted';
        watchText = '';
        statusColor = 'dim';
        bold = false;

      } else {
        this.compilerCtx.hasSuccessfulBuild = true;
        this.compilerCtx.lastBuildHadError = false;
      }

      // print out the time it took to build
      // and add the duration to the build results
      this.timeSpan.finish(`${buildText} ${buildStatus}${watchText}`, statusColor, bold, true);

      // write the build stats
      await generateBuildStats(this.config, this.compilerCtx, this as any, this.buildResults);

      // write all of our logs to disk if config'd to do so
      this.config.logger.writeLogs(this.compilerCtx.isRebuild);

      // emit a build event, which happens for inital build and rebuilds
      this.compilerCtx.events.emit('build', this.buildResults);

      if (this.compilerCtx.isRebuild) {
        // emit a rebuild event, which happens only for rebuilds
        this.compilerCtx.events.emit('rebuild', this.buildResults);
      }

      if (!this.config.watch) {
        this.config.sys.destroy();
      }
    }

    this.hasFinished = true;

    return this.buildResults;
  }

  shouldAbort() {
    if (this.aborted || this.compilerCtx.activeBuildId > this.buildId) {
      // already aborted this build
      // or this is no longer the compiler's active build :(
      this.aborted = true;
      return true;
    }

    if (hasError(this.diagnostics)) {
      // remember if the last build had an error or not
      // this is useful if the next build should do a full build or not
      this.compilerCtx.lastBuildHadError = true;
      this.aborted = true;
      return true;
    }

    return false;
  }

  async validateTypesBuild() {
    if (this.shouldAbort()) {
      // no need to wait on this one since
      // we already aborted this build
      return;
    }

    if (!this.validateTypesPromise) {
      // there is no pending validate types promise
      // so it probably already finished
      // so no need to wait on anything
      return;
    }

    if (!this.config.watch) {
      // this is not a watch build, so we need to make
      // sure that the type validation has finished
      this.config.logger.debug(`build, non-watch, waiting on validateTypes`);
      await this.validateTypesPromise;
      this.config.logger.debug(`build, non-watch, finished waiting on validateTypes`);
    }
  }

}
