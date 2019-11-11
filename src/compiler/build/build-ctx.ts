import * as d from '../../declarations';
import { hasError, hasWarning } from '@utils';


/**
 * A new BuildCtx object is created for every build
 * and rebuild.
 */
export class BuildContext implements d.BuildCtx {
  buildId = -1;
  buildMessages: string[] = [];
  buildResults: d.BuildResults = null;
  bundleBuildCount = 0;
  collections: d.Collection[] = [];
  completedTasks: d.BuildTask[] = [];
  compilerCtx: d.CompilerCtx;
  components: d.ComponentCompilerMeta[] = [];
  componentGraph = new Map<string, string[]>();
  config: d.Config;
  data: any = {};
  diagnostics: d.Diagnostic[] = [];
  dirsAdded: string[] = [];
  dirsDeleted: string[] = [];
  entryModules: d.EntryModule[] = [];
  filesAdded: string[] = [];
  filesChanged: string[] = [];
  filesDeleted: string[] = [];
  filesUpdated: string[] = [];
  filesWritten: string[] = [];
  globalStyle: string = undefined;
  hasConfigChanges = false;
  hasFinished = false;
  hasHtmlChanges = false;
  hasPrintedResults = false;
  hasServiceWorkerChanges = false;
  hasScriptChanges = true;
  hasStyleChanges = true;
  hydrateAppFilePath: string = null;
  indexBuildCount = 0;
  indexDoc: Document = undefined;
  isRebuild = false;
  moduleFiles: d.Module[] = [];
  packageJson: d.PackageJsonData = {};
  packageJsonFilePath: string = null;
  pendingCopyTasks: Promise<d.CopyResults>[] = [];
  requiresFullBuild = true;
  scriptsAdded: string[] = [];
  scriptsDeleted: string[] = [];
  startTime = Date.now();
  styleBuildCount = 0;
  stylesPromise: Promise<void> = null;
  stylesUpdated: d.BuildStyleUpdate[] = [];
  timeSpan: d.LoggerTimeSpan = null;
  timestamp: string;
  transpileBuildCount = 0;
  validateTypesPromise: Promise<d.ValidateTypesResults>;

  constructor(config: d.Config, compilerCtx: d.CompilerCtx) {
    this.config = config;
    this.compilerCtx = compilerCtx;
    this.buildId = ++this.compilerCtx.activeBuildId;
  }

  start() {
    // get the build id from the incremented activeBuildId
    // print out a good message
    const msg = `${this.isRebuild ? 'rebuild' : 'build'}, ${this.config.fsNamespace}, ${this.config.devMode ? 'dev' : 'prod'} mode, started`;

    const buildLog: d.BuildLog = {
      buildId: this.buildId,
      messages: [],
      progress: 0
    };
    this.compilerCtx.events.emit('buildLog', buildLog);

    // create a timespan for this build
    this.timeSpan = this.createTimeSpan(msg);

    // create a build timestamp for this build
    this.timestamp = getBuildTimestamp();

    // debug log our new build
    this.debug(`start build, ${this.timestamp}`);
  }

  createTimeSpan(msg: string, debug?: boolean) {
    if (!this.hasFinished || debug) {
      if (debug) {
        if (this.config.watch) {
          msg = `${this.config.logger.cyan('[' + this.buildId + ']')} ${msg}`;
        }
      }
      const timeSpan = this.config.logger.createTimeSpan(msg, debug, this.buildMessages);

      if (!debug && this.compilerCtx.events) {
        const buildLog: d.BuildLog = {
          buildId: this.buildId,
          messages: this.buildMessages,
          progress: getProgress(this.completedTasks)
        };
        this.compilerCtx.events.emit('buildLog', buildLog);
      }

      return {
        duration: () => {
          return timeSpan.duration();
        },
        finish: (finishedMsg: string, color?: string, bold?: boolean, newLineSuffix?: boolean) => {
          if (!this.hasFinished || debug) {
            if (debug) {
              if (this.config.watch) {
                finishedMsg = `${this.config.logger.cyan('[' + this.buildId + ']')} ${finishedMsg}`;
              }
            }

            timeSpan.finish(finishedMsg, color, bold, newLineSuffix);

            if (!debug) {
              const buildLog: d.BuildLog = {
                buildId: this.buildId,
                messages: this.buildMessages.slice(),
                progress: getProgress(this.completedTasks)
              };
              this.compilerCtx.events.emit('buildLog', buildLog);
            }
          }
          return timeSpan.duration();
        }
      };
    }

    return {
      duration() { return 0; },
      finish() { return 0; }
    };
  }

  debug(msg: string) {
    if (this.config.watch) {
      this.config.logger.debug(`${this.config.logger.cyan('[' + this.buildId + ']')} ${msg}`);
    } else {
      this.config.logger.debug(msg);
    }
  }

  get hasError() {
    return hasError(this.diagnostics);
  }

  get hasWarning() {
    return hasWarning(this.diagnostics);
  }

  progress(t: d.BuildTask) {
    this.completedTasks.push(t);
  }

  async validateTypesBuild() {
    if (this.hasError) {
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
      this.debug(`build, non-watch, waiting on validateTypes`);
      await this.validateTypesPromise;
      this.debug(`build, non-watch, finished waiting on validateTypes`);
    }
  }

}


export const getBuildTimestamp = () => {
  const d = new Date();

  // YYYY-MM-DDThh:mm:ss
  let timestamp = d.getUTCFullYear() + '-';
  timestamp += ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-';
  timestamp += ('0' + d.getUTCDate()).slice(-2) + 'T';
  timestamp += ('0' + d.getUTCHours()).slice(-2) + ':';
  timestamp += ('0' + d.getUTCMinutes()).slice(-2) + ':';
  timestamp += ('0' + d.getUTCSeconds()).slice(-2);

  return timestamp;
};

const getProgress = (completedTasks: d.BuildTask[]) => {
  let progressIndex = 0;
  const taskKeys = Object.keys(ProgressTask);

  taskKeys.forEach((taskKey, index) => {
    if (completedTasks.includes((ProgressTask as any)[taskKey])) {
      progressIndex = index;
    }
  });

  return (progressIndex + 1) / taskKeys.length;
};

export const ProgressTask = {
  emptyOutputTargets: {},
  transpileApp: {},
  generateStyles: {},
  generateOutputTargets: {},
  validateTypesBuild: {},
  writeBuildFiles: {},
};
