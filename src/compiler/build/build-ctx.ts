import * as d from '../../declarations';
import { buildFinish } from './build-finish';
import { hasError, hasWarning } from '@utils';


/**
 * A new BuildCtx object is created for every build
 * and rebuild.
 */
export class BuildContext implements d.BuildCtx {
  appFileBuildCount = 0;
  buildId = -1;
  buildMessages: string[] = [];
  buildResults: d.BuildResults = null;
  bundleBuildCount = 0;
  collections: d.Collection[] = [];
  components: d.ComponentCompilerMeta[] = [];
  data: any = {};
  indexDoc: Document = undefined;
  diagnostics: d.Diagnostic[] = [];
  dirsAdded: string[] = [];
  dirsDeleted: string[] = [];
  entryModules: d.EntryModule[] = [];
  filesAdded: string[] = [];
  filesChanged: string[] = [];
  filesDeleted: string[] = [];
  filesUpdated: string[] = [];
  filesWritten: string[] = [];
  skipAssetsCopy = false;
  global: d.Module = null;
  graphData: d.GraphData = null;
  hasConfigChanges = false;
  hasCopyChanges = false;
  hasFinished = false;
  hasIndexHtmlChanges = false;
  hasPrintedResults = false;
  hasServiceWorkerChanges = false;
  hasScriptChanges = true;
  hasSlot: boolean = null;
  hasStyleChanges = true;
  hasSvg: boolean = null;
  hydrateAppFilePath: string = null;
  indexBuildCount = 0;
  isRebuild = false;
  moduleFiles: d.Module[] = [];
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
  pendingCopyTasks: Promise<d.CopyResults>[] = [];
  validateTypesPromise: Promise<d.ValidateTypesResults>;
  packageJson: d.PackageJsonData = {};

  constructor(private config: d.Config, private compilerCtx: d.CompilerCtx) {
    this.buildId = ++this.compilerCtx.activeBuildId;
  }

  start() {
    // get the build id from the incremented activeBuildId
    // print out a good message
    const msg = `${this.isRebuild ? 'rebuild' : 'build'}, ${this.config.fsNamespace}, ${this.config.devMode ? 'dev' : 'prod'} mode, started`;

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
        this.compilerCtx.events.emit('buildLog', {
          messages: this.buildMessages.slice()
        } as d.BuildLog);
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
              this.compilerCtx.events.emit('buildLog', {
                messages: this.buildMessages.slice()
              } as d.BuildLog);
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
    if (hasError(this.diagnostics)) {
      // remember if the last build had an error or not
      // this is useful if the next build should do a full build or not
      this.compilerCtx.lastBuildHadError = true;
      return true;
    }

    return false;
  }

  get shouldAbort() {
    return this.hasError;
  }

  get hasWarning() {
    if (hasWarning(this.diagnostics)) {
      return true;
    }
    return false;
  }

  async abort() {
    return buildFinish(this.config, this.compilerCtx, this as any, true);
  }

  async finish() {
    return buildFinish(this.config, this.compilerCtx, this as any, false);
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


export function getBuildTimestamp() {
  const d = new Date();

  // YYYY-MM-DDThh:mm:ss
  let timestamp = d.getUTCFullYear() + '-';
  timestamp += ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-';
  timestamp += ('0' + d.getUTCDate()).slice(-2) + 'T';
  timestamp += ('0' + d.getUTCHours()).slice(-2) + ':';
  timestamp += ('0' + d.getUTCMinutes()).slice(-2) + ':';
  timestamp += ('0' + d.getUTCSeconds()).slice(-2);

  return timestamp;
}
