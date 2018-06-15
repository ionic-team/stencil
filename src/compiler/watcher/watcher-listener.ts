import { CompilerCtx, Config, WatcherResults } from '../../declarations';
import { COMPONENTS_DTS } from '../distribution/distribution';
import { copyTasks, isCopyTaskFile } from '../copy/copy-tasks';
import { isDtsFile, isWebDevFile, normalizePath } from '../util';
import { rebuild } from './rebuild';


export class WatcherListener {
  private dirsAdded: string[];
  private dirsDeleted: string[];
  private filesAdded: string[];
  private filesDeleted: string[];
  private filesUpdated: string[];
  private configUpdated = false;
  private recentChanges: RecentChange[] = [];

  private watchTmr: NodeJS.Timer;
  private copyTaskTmr: NodeJS.Timer;


  constructor(private config: Config, private compilerCtx: CompilerCtx) {
    this.resetWatcher();
  }

  subscribe() {
    this.compilerCtx.events.subscribe('fileUpdate', this.fileUpdate.bind(this));
    this.compilerCtx.events.subscribe('fileAdd', this.fileAdd.bind(this));
    this.compilerCtx.events.subscribe('fileDelete', this.fileDelete.bind(this));
    this.compilerCtx.events.subscribe('dirAdd', this.dirAdd.bind(this));
    this.compilerCtx.events.subscribe('dirDelete', this.dirDelete.bind(this));
  }

  async fileUpdate(filePath: string) {
    try {
      filePath = normalizePath(filePath);
      const relPath = this.config.sys.path.relative(this.config.rootDir, filePath);

      if (isComponentsDtsFile(filePath)) {
        return;
      }

      if (filePath === this.config.configPath) {
        this.config.logger.debug(`watcher, fileUpdate, config: ${relPath}, ${Date.now().toString().substring(5)}`);
        // the actual stencil config file changed
        // this is a big deal, so do a full rebuild
        this.configUpdated = true;
        if (!this.filesUpdated.includes(filePath)) {
          this.filesUpdated.push(filePath);
        }
        this.queue(filePath);

      } else if (isCopyTaskFile(this.config, filePath)) {
        this.config.logger.debug(`watcher, fileUpdate, copy task file: ${relPath}, ${Date.now().toString().substring(5)}`);
        this.queueCopyTasks();
      }

      if (isWebDevFileToWatch(filePath)) {
        // check if the file changed with a read the file, but without using
        // the cache so we know if it actually changed or not
        const hasChanged = await this.compilerCtx.fs.hasFileChanged(filePath);
        if (!hasChanged) {
          this.config.logger.debug(`watcher, fileUpdate, file unchanged: ${relPath}, ${Date.now().toString().substring(5)}`);
          return;
        }

        this.config.logger.debug(`watcher, fileUpdate: ${relPath}, ${Date.now().toString().substring(5)}`);

        // web dev file was updaed
        // queue change build
        if (!this.filesUpdated.includes(filePath)) {
          this.filesUpdated.push(filePath);
        }
        this.queue(filePath);

      } else {
        // always clear the cache if it wasn't a web dev file
        this.compilerCtx.fs.clearFileCache(filePath);
        this.config.logger.debug(`clear file cache: ${filePath}`);
      }

    } catch (e) {
      this.config.logger.error(`watcher, fileUpdate`, e);
    }
  }

  async fileAdd(filePath: string) {
    try {
      filePath = normalizePath(filePath);
      const relPath = this.config.sys.path.relative(this.config.rootDir, filePath);

      if (isComponentsDtsFile(filePath)) {
        return;
      }

      this.config.logger.debug(`watcher, fileAdd: ${relPath}, ${Date.now().toString().substring(5)}`);

      if (isCopyTaskFile(this.config, filePath)) {
        this.queueCopyTasks();
      }

      if (isWebDevFileToWatch(filePath)) {
        // read the file, but without using
        // the cache so we get the latest change
        await this.compilerCtx.fs.readFile(filePath, { useCache: false });

        // new web dev file was added
        if (!this.filesAdded.includes(filePath)) {
          this.filesAdded.push(filePath);
        }
        this.queue(filePath);

      } else {
        // always clear the cache if it wasn't a web dev file
        this.compilerCtx.fs.clearFileCache(filePath);
        this.config.logger.debug(`clear file cache: ${filePath}`);
      }

    } catch (e) {
      this.config.logger.error(`watcher, fileAdd`, e);
    }
  }

  fileDelete(filePath: string) {
    try {
      filePath = normalizePath(filePath);
      const relPath = this.config.sys.path.relative(this.config.rootDir, filePath);

      if (isComponentsDtsFile(filePath)) {
        return;
      }

      this.config.logger.debug(`watcher, fileDelete: ${relPath}, ${Date.now().toString().substring(5)}`);

      // clear this file's cache
      this.compilerCtx.fs.clearFileCache(filePath);

      if (isCopyTaskFile(this.config, filePath)) {
        this.queueCopyTasks();
      }

      if (isWebDevFileToWatch(filePath)) {
        // web dev file was delete
        if (!this.filesDeleted.includes(filePath)) {
          this.filesDeleted.push(filePath);
        }
        this.queue(filePath);
      }

    } catch (e) {
      this.config.logger.error(`watcher, fileDelete`, e);
    }
  }

  async dirAdd(dirPath: string) {
    try {
      dirPath = normalizePath(dirPath);
      const relPath = this.config.sys.path.relative(this.config.rootDir, dirPath);

      this.config.logger.debug(`watcher, dirAdd: ${relPath}, ${Date.now().toString().substring(5)}`);

      // clear this directory's cache for good measure
      this.compilerCtx.fs.clearDirCache(dirPath);

      if (isCopyTaskFile(this.config, dirPath)) {
        this.queueCopyTasks();

      } else {
        // recursively drill down and get all of the
        // files paths that were just added
        const addedItems = await this.compilerCtx.fs.readdir(dirPath, { recursive: true });

        addedItems.forEach(item => {
          if (!this.filesAdded.includes(item.absPath)) {
            this.filesAdded.push(item.absPath);
          }
        });

        this.dirsAdded.push(dirPath);
        this.queue(dirPath);
      }

    } catch (e) {
      this.config.logger.error(`watcher, dirAdd`, e);
    }
  }

  async dirDelete(dirPath: string) {
    try {
      dirPath = normalizePath(dirPath);
      const relPath = this.config.sys.path.relative(this.config.rootDir, dirPath);

      this.config.logger.debug(`watcher, dirDelete: ${relPath}, ${Date.now().toString().substring(5)}`);

      // clear this directory's cache
      this.compilerCtx.fs.clearDirCache(dirPath);

      if (isCopyTaskFile(this.config, dirPath)) {
        this.queueCopyTasks();

      } else {
        if (!this.dirsDeleted.includes(dirPath)) {
          this.dirsDeleted.push(dirPath);
        }
        this.queue(dirPath);
      }

    } catch (e) {
      this.config.logger.error(`watcher, dirDelete`, e);
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
      this.config.logger.error(`watcher, startRebuild`, e);
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

  queue(absPath: string) {
    this.recentChanges = this.recentChanges.filter(rc => {
      // only keep changes that happened in the last XX milliseconds
      return (Date.now() - 500) < rc.timestamp;
    });

    if (this.recentChanges.some(rc => rc.filePath === absPath)) {
      // we already kicked off a build for this path
      // within the last XX milliseconds, let's just ignore the subsequent changes
      this.config.logger.debug(`skipping recent subsequent file change: ${absPath}`);
      return;
    }

    // debounce builds
    clearTimeout(this.watchTmr);

    this.recentChanges.push({
      filePath: absPath,
      timestamp: Date.now()
    });

    this.watchTmr = setTimeout(() => {
      this.startRebuild();
    }, 20);
  }

  queueCopyTasks() {
    clearTimeout(this.copyTaskTmr);

    this.copyTaskTmr = setTimeout(async () => {
      await copyTasks(this.config, this.compilerCtx, [], true);
    }, 100);
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
  return isWebDevFile(filePath) || (isDtsFile(filePath) && !isComponentsDtsFile(filePath));
}


function isComponentsDtsFile(filePath: string) {
  return filePath.endsWith(COMPONENTS_DTS);
}


interface RecentChange {
  filePath: string;
  timestamp: number;
}
