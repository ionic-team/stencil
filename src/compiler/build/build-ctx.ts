import * as d from '../../declarations';
import { catchError, hasError } from '../util';
import { generateBuildResults } from './build-results';
import { generateBuildStats } from './build-stats';
import { initWatcher } from '../watcher/watcher-init';


export class BuildContext implements d.BuildCtx {
  appFileBuildCount = 0;
  buildId = -1;
  timestamp: string;
  buildResults: d.BuildResults = null;
  bundleBuildCount = 0;
  changedExtensions: string[] = [];
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
  hasCopyChanges = false;
  hasFinished = false;
  hasIndexHtmlChanges = false;
  hasScriptChanges = true;
  hasSlot: boolean = null;
  hasStyleChanges = true;
  hasSvg: boolean = null;
  indexBuildCount = 0;
  isRebuild = false;
  requiresFullBuild = true;
  startTime = Date.now();
  styleBuildCount = 0;
  stylesUpdated: { [styleId: string]: string } = {};
  timeSpan: d.LoggerTimeSpan = null;
  transpileBuildCount = 0;
  validateTypesPromise: Promise<d.ValidateTypesResults>;

  constructor(private config: d.Config, private compilerCtx: d.CompilerCtx, watchResults: d.WatchResults = null) {
    this.setBuildTimestamp();

    // do a full build if there is no watcher
    // or the watcher said the config has updated
    // or we've never had a successful build yet
    this.requiresFullBuild = (!watchResults || watchResults.configUpdated || !compilerCtx.hasSuccessfulBuild);

    this.isRebuild = !!watchResults;

    // increment the active build id
    compilerCtx.activeBuildId++;
    this.buildId = compilerCtx.activeBuildId;

    this.config.logger.debug(`start build: ${this.buildId}, ${this.timestamp}`);

    const msg = `${this.isRebuild ? 'rebuild' : 'build'}, ${config.fsNamespace}, ${config.devMode ? 'dev' : 'prod'} mode, started`;
    this.timeSpan = this.createTimeSpan(msg);

    const buildStartData: d.BuildStartData = {
      buildId: this.buildId,
      isRebuild: this.isRebuild,
      startTime: Date.now(),
      filesChanged: null,
      filesUpdated: null,
      filesAdded: null,
      filesDeleted: null,
      dirsDeleted: null,
      dirsAdded: null,
    };

    if (watchResults != null) {
      this.hasCopyChanges = watchResults.hasCopyChanges;
      this.hasScriptChanges = watchResults.hasScriptChanges;
      this.hasStyleChanges = watchResults.hasStyleChanges;
      this.hasIndexHtmlChanges = watchResults.hasIndexHtmlChanges;

      this.filesChanged.push(...watchResults.filesChanged);
      this.filesUpdated.push(...watchResults.filesUpdated);
      this.filesAdded.push(...watchResults.filesAdded);
      this.filesDeleted.push(...watchResults.filesDeleted);
      this.dirsDeleted.push(...watchResults.dirsDeleted);
      this.dirsAdded.push(...watchResults.dirsAdded);

      buildStartData.filesChanged = this.filesChanged.slice();
      buildStartData.filesUpdated = this.filesUpdated.slice();
      buildStartData.filesAdded = this.filesAdded.slice();
      buildStartData.filesDeleted = this.filesDeleted.slice();
      buildStartData.dirsDeleted = this.dirsDeleted.slice();
      buildStartData.dirsAdded = this.dirsAdded.slice();
    }

    // emit a buildStart event for anyone who cares
    this.compilerCtx.events.emit('buildStart', buildStartData);
  }

  setBuildTimestamp() {
    const d = new Date();

    // YYYY-MM-DDThh:mm:ss
    this.timestamp = d.getUTCFullYear() + '-';
    this.timestamp += ('0' + d.getUTCMonth()).slice(-2) + '-';
    this.timestamp += ('0' + d.getUTCDate()).slice(-2) + 'T';
    this.timestamp += ('0' + d.getUTCHours()).slice(-2) + ':';
    this.timestamp += ('0' + d.getUTCMinutes()).slice(-2) + ':';
    this.timestamp += ('0' + d.getUTCSeconds()).slice(-2);
  }

  createTimeSpan(msg: string, debug?: boolean) {
    if (this.buildId === this.compilerCtx.activeBuildId || debug) {
      const timeSpan = this.config.logger.createTimeSpan(msg, debug);

      return {
        finish: (finishedMsg: string, color?: string, bold?: boolean, newLineSuffix?: boolean) => {
          if (this.buildId === this.compilerCtx.activeBuildId || debug) {
            timeSpan.finish(finishedMsg, color, bold, newLineSuffix);
          }
        }
      };
    }

    return {
      finish: () => {/**/}
    };
  }

  get isActiveBuild() {
    return this.compilerCtx.activeBuildId === this.buildId;
  }

  async finish() {
    this.config.logger.debug(`finished build: ${this.buildId}, ${this.timestamp}`);

    if (this.hasFinished && this.buildResults) {
      return this.buildResults;
    }

    this.buildResults = await generateBuildResults(this.config, this.compilerCtx, this as any);

    // log any errors/warnings
    if (!this.hasFinished) {
      // haven't set this build as finished yet
      this.config.logger.printDiagnostics(this.buildResults.diagnostics);

      // create a nice pretty message stating what happend
      const buildText = this.isRebuild ? 'rebuild' : 'build';
      const watchText = this.config.watch ? ', watching for changes...' : '';
      let buildStatus = 'finished';
      let statusColor = 'green';

      if (this.buildResults.hasError) {
        // gosh darn, build had errors :(
        this.compilerCtx.lastBuildHadError = true;
        buildStatus = 'failed';
        statusColor = 'red';

      } else {
        // successful build!
        this.compilerCtx.hasSuccessfulBuild = true;
        this.compilerCtx.lastBuildHadError = false;

        if (!this.isRebuild && this.config.watch) {
          // successful first time build and we're watching the files
          // so let's hash all of the source files content so we can
          // do great file change detection to know when files actually change
          this.compilerCtx.fs.setBuildHashes();
        }
      }

      // print out the time it took to build
      // and add the duration to the build results
      this.timeSpan.finish(`${buildText} ${buildStatus}${watchText}`, statusColor, true, true);

      // write the build stats
      await generateBuildStats(this.config, this.compilerCtx, this as any, this.buildResults);

      // write all of our logs to disk if config'd to do so
      this.config.logger.writeLogs(this.isRebuild);

      // emit a buildFinish event for anyone who cares
      this.compilerCtx.events.emit('buildFinish', this.buildResults);

      if (this.config.watch) {
        try {
          // setup watcher if need be
          initWatcher(this.config, this.compilerCtx);
        } catch (e) {
          catchError(this.diagnostics, e);
        }

      } else {
        this.config.sys.destroy();
      }
    }

    this.hasFinished = true;

    return this.buildResults;
  }

  shouldAbort() {
    if (hasError(this.diagnostics)) {
      // remember if the last build had an error or not
      // this is useful if the next build should do a full build or not
      this.compilerCtx.lastBuildHadError = true;
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
