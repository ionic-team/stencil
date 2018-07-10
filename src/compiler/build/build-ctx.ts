import * as d from '../../declarations';
import { buildFinish } from './build-finish';
import { hasError } from '../util';


export class BuildContext implements d.BuildCtx {
  appFileBuildCount = 0;
  buildId = -1;
  buildMessages: string[] = [];
  timestamp: string;
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
  hasConfigChanges = false;
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
  scriptsAdded: string[] = [];
  scriptsDeleted: string[] = [];
  startTime = Date.now();
  styleBuildCount = 0;
  stylesUpdated = [] as d.BuildStyleUpdate[];
  timeSpan: d.LoggerTimeSpan = null;
  transpileBuildCount = 0;
  validateTypesPromise: Promise<d.ValidateTypesResults>;

  constructor(private config: d.Config, private compilerCtx: d.CompilerCtx) {}

  start() {
    // get the build id from the incremented activeBuildId
    ++this.compilerCtx.activeBuildId;

    if (this.compilerCtx.activeBuildId >= 100) {
      // reset the build id back to 0
      this.compilerCtx.activeBuildId = 0;
    }

    this.buildId = this.compilerCtx.activeBuildId;

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
    if ((this.isActiveBuild && !this.hasFinished) || debug) {
      if (debug) {
        msg = `${this.config.logger.cyan('[' + this.buildId + ']')} ${msg}`;
      }
      const timeSpan = this.config.logger.createTimeSpan(msg, debug, this.buildMessages);

      if (!debug && this.compilerCtx.events) {
        this.compilerCtx.events.emit('buildLog', {
          messages: this.buildMessages.slice()
        } as d.BuildLog);
      }

      return {
        finish: (finishedMsg: string, color?: string, bold?: boolean, newLineSuffix?: boolean) => {
          if ((this.isActiveBuild && !this.hasFinished) || debug) {
            if (debug) {
              finishedMsg = `${this.config.logger.cyan('[' + this.buildId + ']')} ${finishedMsg}`;
            }

            timeSpan.finish(finishedMsg, color, bold, newLineSuffix);

            if (!debug) {
              this.compilerCtx.events.emit('buildLog', {
                messages: this.buildMessages.slice()
              } as d.BuildLog);
            }
          }
        }
      };
    }

    return {
      finish: () => {/**/}
    };
  }

  debug(msg: string) {
    this.config.logger.debug(`${this.config.logger.cyan('[' + this.buildId + ']')} ${msg}`);
  }

  get isActiveBuild() {
    return (this.compilerCtx.activeBuildId === this.buildId);
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

  async abort() {
    return buildFinish(this.config, this.compilerCtx, this as any, true);
  }

  async finish() {
    return buildFinish(this.config, this.compilerCtx, this as any, false);
  }

  async validateTypesBuild() {
    if (this.hasError || !this.isActiveBuild) {
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


function getBuildTimestamp() {
  const d = new Date();

  // YYYY-MM-DDThh:mm:ss
  let timestamp = d.getUTCFullYear() + '-';
  timestamp += ('0' + d.getUTCMonth()).slice(-2) + '-';
  timestamp += ('0' + d.getUTCDate()).slice(-2) + 'T';
  timestamp += ('0' + d.getUTCHours()).slice(-2) + ':';
  timestamp += ('0' + d.getUTCMinutes()).slice(-2) + ':';
  timestamp += ('0' + d.getUTCSeconds()).slice(-2);

  return timestamp;
}
