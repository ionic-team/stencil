import { BuildCtx, CompilerCtx, Config, WatcherResults } from '../../declarations';
import { COMPONENTS_DTS } from '../build/distribution';
import { configFileReload, rebuild } from './rebuild';
import { copyTasks, isCopyTaskFile } from '../copy/copy-tasks';
import { isDtsFile, isWebDevFile, normalizePath } from '../util';


export class WatcherListener {
  private dirsAdded: string[];
  private dirsDeleted: string[];
  private filesAdded: string[];
  private filesDeleted: string[];
  private filesUpdated: string[];
  private configUpdated = false;

  private watchTmr: NodeJS.Timer;
  private copyTaskTmr: NodeJS.Timer;


  constructor(private config: Config, private compilerCtx: CompilerCtx, private buildCtx: BuildCtx) {
    this.resetWatcher();
  }

  subscribe() {
    this.compilerCtx.events.subscribe('fileUpdate', this.fileUpdate.bind(this));
    this.compilerCtx.events.subscribe('fileAdd', this.fileAdd.bind(this));
    this.compilerCtx.events.subscribe('fileDelete', this.fileDelete.bind(this));
    this.compilerCtx.events.subscribe('dirAdd', this.dirAdd.bind(this));
    this.compilerCtx.events.subscribe('dirDelete', this.dirDelete.bind(this));
  }

  async fileUpdate(path: string) {
    try {
      path = normalizePath(path);

      this.config.logger.debug(`watcher, fileUpdate: ${path}, ${Date.now()}`);

      if (path === this.config.configPath) {
        // the actual stencil config file changed
        // this is a big deal, so do a full rebuild
        configFileReload(this.config);
        this.configUpdated = true;
        if (!this.filesUpdated.includes(path)) {
          this.filesUpdated.push(path);
        }
        this.queue();

      } else if (isCopyTaskFile(this.config, path)) {
        this.queueCopyTasks();
      }

      if (isWebDevFileToWatch(path)) {
        // read the file, but without using
        // the cache so we get the latest change
        await this.compilerCtx.fs.readFile(path, { useCache: false });

        // web dev file was updaed
        // queue change build
        if (!this.filesUpdated.includes(path)) {
          this.filesUpdated.push(path);
        }
        this.queue();

      } else {
        // always clear the cache if it wasn't a web dev file
        this.compilerCtx.fs.clearFileCache(path);
        this.config.logger.debug(`clear file cache: ${path}`);
      }

    } catch (e) {
      this.config.logger.error(`watcher, fileUpdate: ${e}`);
    }
  }

  async fileAdd(path: string) {
    try {
      path = normalizePath(path);

      this.config.logger.debug(`watcher, fileAdd: ${path}, ${Date.now()}`);

      if (isCopyTaskFile(this.config, path)) {
        this.queueCopyTasks();
      }

      if (isWebDevFileToWatch(path)) {
        // read the file, but without using
        // the cache so we get the latest change
        await this.compilerCtx.fs.readFile(path, { useCache: false });

        // new web dev file was added
        if (!this.filesAdded.includes(path)) {
          this.filesAdded.push(path);
        }
        this.queue();

      } else {
        // always clear the cache if it wasn't a web dev file
        this.compilerCtx.fs.clearFileCache(path);
        this.config.logger.debug(`clear file cache: ${path}`);
      }

    } catch (e) {
      this.config.logger.error(`watcher, fileAdd: ${e}`);
    }
  }

  fileDelete(path: string) {
    try {
      path = normalizePath(path);

      this.config.logger.debug(`watcher, fileDelete: ${path}, ${Date.now()}`);

      // clear this file's cache
      this.compilerCtx.fs.clearFileCache(path);

      if (isCopyTaskFile(this.config, path)) {
        this.queueCopyTasks();
      }

      if (isWebDevFileToWatch(path)) {
        // web dev file was delete
        if (!this.filesDeleted.includes(path)) {
          this.filesDeleted.push(path);
        }
        this.queue();
      }

    } catch (e) {
      this.config.logger.error(`watcher, fileDelete: ${e}`);
    }
  }

  async dirAdd(path: string) {
    try {
      path = normalizePath(path);

      this.config.logger.debug(`watcher, dirAdd: ${path}, ${Date.now()}`);

      // clear this directory's cache for good measure
      this.compilerCtx.fs.clearDirCache(path);

      if (isCopyTaskFile(this.config, path)) {
        this.queueCopyTasks();

      } else {
        // recursively drill down and get all of the
        // files paths that were just added
        const addedItems = await this.compilerCtx.fs.readdir(path, { recursive: true });

        addedItems.forEach(item => {
          if (!this.filesAdded.includes(item.absPath)) {
            this.filesAdded.push(item.absPath);
          }
        });

        this.dirsAdded.push(path);
        this.queue();
      }

    } catch (e) {
      this.config.logger.error(`watcher, dirAdd: ${e}`);
    }
  }

  async dirDelete(path: string) {
    try {
      path = normalizePath(path);

      this.config.logger.debug(`watcher, dirDelete: ${path}, ${Date.now()}`);

      // clear this directory's cache
      this.compilerCtx.fs.clearDirCache(path);

      if (isCopyTaskFile(this.config, path)) {
        this.queueCopyTasks();

      } else {
        if (!this.dirsDeleted.includes(path)) {
          this.dirsDeleted.push(path);
        }
        this.queue();
      }

    } catch (e) {
      this.config.logger.error(`dirDelete, dirAdd: ${e}`);
    }
  }

  startRebuild() {
    try {
      // create a copy of all that we've learned today
      const watcher = this.generateWatcherResults();

      // reset the watcher data for next time
      this.resetWatcher();

      if (shouldRebuild(watcher)) {
        // kick off the rebuild
        rebuild(this.config, this.compilerCtx, watcher);
      }

    } catch (e) {
      this.config.logger.error(e.toString());
    }
  }

  generateWatcherResults() {
    const watcher: WatcherResults = {
      dirsAdded: this.dirsAdded.slice(),
      dirsDeleted: this.dirsDeleted.slice(),
      filesAdded: this.filesAdded.slice(),
      filesDeleted: this.filesDeleted.slice(),
      filesUpdated: this.filesUpdated.slice(),
      filesChanged: this.filesUpdated.concat(this.filesAdded, this.filesDeleted),
      configUpdated: this.configUpdated
    };
    return watcher;
  }

  queue() {
    // debounce builds
    clearTimeout(this.watchTmr);

    this.watchTmr = setTimeout(() => {
      this.startRebuild();
    }, 40);
  }

  queueCopyTasks() {
    clearTimeout(this.copyTaskTmr);

    this.copyTaskTmr = setTimeout(() => {
      copyTasks(this.config, this.compilerCtx, this.buildCtx);
    }, 80);
  }

  resetWatcher() {
    this.dirsAdded = [];
    this.dirsDeleted = [];
    this.filesAdded = [];
    this.filesDeleted = [];
    this.filesUpdated = [];
    this.configUpdated = false;
  }

}


function shouldRebuild(watcher: WatcherResults) {
  return watcher.configUpdated ||
  watcher.dirsAdded.length > 0 ||
  watcher.dirsDeleted.length > 0 ||
  watcher.filesAdded.length > 0 ||
  watcher.filesDeleted.length > 0 ||
  watcher.filesUpdated.length > 0;
}


function isWebDevFileToWatch(filePath: string) {
  // ts, tsx, css, scss, js, html
  // but don't worry about jpg, png, gif, svgs
  // also don't bother rebuilds when the components.d.ts file gets updated
  return isWebDevFile(filePath) || (isDtsFile(filePath) && filePath.indexOf(COMPONENTS_DTS) === -1);
}
