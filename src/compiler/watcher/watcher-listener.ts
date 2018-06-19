import * as d from '../../declarations';
import { COMPONENTS_DTS } from '../distribution/distribution';
import { isCopyTaskFile } from '../copy/config-copy-tasks';
import { isDtsFile, isWebDevFile, normalizePath } from '../util';
import { rebuild } from './rebuild';


export class WatcherListener {
  private dirsAdded: string[];
  private dirsDeleted: string[];
  private filesAdded: string[];
  private filesDeleted: string[];
  private filesUpdated: string[];
  private configUpdated = false;
  private hasCopyChanges = false;
  private watchTmr: number;

  constructor(private config: d.Config, private compilerCtx: d.CompilerCtx) {
    this.resetWatcher();
  }

  subscribe() {
    this.compilerCtx.events.subscribe('fileUpdate', this.fileUpdate.bind(this));
    this.compilerCtx.events.subscribe('fileAdd', this.fileAdd.bind(this));
    this.compilerCtx.events.subscribe('fileDelete', this.fileDelete.bind(this));
    this.compilerCtx.events.subscribe('dirAdd', this.dirAdd.bind(this));
    this.compilerCtx.events.subscribe('dirDelete', this.dirDelete.bind(this));
  }

  fileUpdate(filePath: string) {
    try {
      filePath = normalizePath(filePath);
      const relPath = this.config.sys.path.relative(this.config.rootDir, filePath);

      if (isComponentsDtsFile(filePath)) {
        // don't bother any of this for the components.d.ts file
        // which the change came from us anyways
        return;
      }

      const ext = this.config.sys.path.extname(filePath).toLowerCase();
      const isTextFile = TXT_EXT.includes(ext);

      if (isTextFile) {
        // only bother checking if a file changed if it's
        // a well known text file we're probably editing
        // otherwise for things like images/pdfs/xls/etc don't bother
        if (!this.compilerCtx.fs.hasFileChanged(filePath)) {
          // the content hasn't actually changed from the last
          // time we did a build so don't even bother doing another build
          this.config.logger.debug(`watcher, fileUpdate, file unchanged: ${relPath}, ${Date.now().toString().substring(5)}`);
          this.queue();
          return;
        }
      }

      if (filePath === this.config.configPath) {
        // the actual stencil config file changed
        // this is a big deal, so do a full rebuild
        this.config.logger.debug(`watcher, fileUpdate, config: ${relPath}, ${Date.now().toString().substring(5)}`);
        this.configUpdated = true;
        this.compilerCtx.fs.clearFileCache(filePath);

        if (!this.filesUpdated.includes(filePath)) {
          this.filesUpdated.push(filePath);
        }
        this.queue();
        return;
      }

      // could be both a copy task and a web dev file
      const isCopy = isCopyTaskFile(this.config, filePath);
      const isWebDev = isWebDevFileToWatch(filePath);

      if (isCopy) {
        // this file is one of the files in our copy tasks
        this.config.logger.debug(`watcher, fileUpdate, copy task file: ${relPath}, ${Date.now().toString().substring(5)}`);
        this.hasCopyChanges = true;
      }

      if (isWebDev) {
        // this is a web dev file like .ts or .css
        this.config.logger.debug(`watcher, fileUpdate: ${relPath}, ${Date.now().toString().substring(5)}`);
      }

      if (isCopy || isWebDev) {
        // if it's a copy or web dev file let's add it to the queue
        if (!this.filesUpdated.includes(filePath)) {
          this.filesUpdated.push(filePath);
        }
        this.queue();
      }

      if (!isTextFile && !isCopy && !isWebDev) {
        // only clear the cache if it's not a text file or web dev file
        // because earlier we already read and cached the new content
        // otherwise it's probably best to clear this file's cache now
        this.compilerCtx.fs.clearFileCache(filePath);
        this.config.logger.debug(`watcher, fileUpdate, clear file cache: ${relPath}`);
      }

    } catch (e) {
      this.config.logger.error(`watcher, fileUpdate`, e);
    }
  }

  fileAdd(filePath: string) {
    try {
      filePath = normalizePath(filePath);
      const relPath = this.config.sys.path.relative(this.config.rootDir, filePath);

      if (isComponentsDtsFile(filePath)) {
        return;
      }

      this.config.logger.debug(`watcher, fileAdd: ${relPath}, ${Date.now().toString().substring(5)}`);

      if (isCopyTaskFile(this.config, filePath)) {
        if (!this.filesAdded.includes(filePath)) {
          this.filesAdded.push(filePath);
        }
        this.hasCopyChanges = true;
        this.queue();
      }

      if (isWebDevFileToWatch(filePath)) {
        // read the file, but without using
        // the cache so we get the latest change
        this.compilerCtx.fs.readFileSync(filePath, { useCache: false });

        // new web dev file was added
        if (!this.filesAdded.includes(filePath)) {
          this.filesAdded.push(filePath);
        }
        this.queue();

      } else {
        // always clear the cache if it wasn't a web dev file
        this.compilerCtx.fs.clearFileCache(filePath);
        this.config.logger.debug(`watcher, fileAdd, clear file cache: ${relPath}`);
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
        if (!this.filesDeleted.includes(filePath)) {
          this.filesDeleted.push(filePath);
        }
        this.hasCopyChanges = true;
        this.queue();
      }

      if (isWebDevFileToWatch(filePath)) {
        // web dev file was delete
        if (!this.filesDeleted.includes(filePath)) {
          this.filesDeleted.push(filePath);
        }
        this.queue();
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

      // recursively drill down and get all of the
      // files paths that were just added
      const addedItems = await this.compilerCtx.fs.readdir(dirPath, { recursive: true });

      addedItems.forEach(item => {
        if (!this.filesAdded.includes(item.absPath)) {
          this.filesAdded.push(item.absPath);
        }
      });
      this.dirsAdded.push(dirPath);

      if (isCopyTaskFile(this.config, dirPath)) {
        this.hasCopyChanges = true;
      }

      this.queue();

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

      if (!this.dirsDeleted.includes(dirPath)) {
        this.dirsDeleted.push(dirPath);
      }

      if (isCopyTaskFile(this.config, dirPath)) {
        this.hasCopyChanges = true;
      }

      this.queue();

    } catch (e) {
      this.config.logger.error(`watcher, dirDelete`, e);
    }
  }

  startRebuild() {
    try {
      // create a copy of all that we've learned today
      const watchResults: d.WatchResults = {
        dirsAdded: this.dirsAdded.slice(),
        dirsDeleted: this.dirsDeleted.slice(),
        filesAdded: this.filesAdded.slice(),
        filesDeleted: this.filesDeleted.slice(),
        filesUpdated: this.filesUpdated.slice(),
        configUpdated: this.configUpdated,
        hasCopyChanges: this.hasCopyChanges,
        filesChanged: [],
        changedExtensions: [],
        hasScriptChanges: false,
        hasStyleChanges: false,
        hasImageChanges: false
      };

      // reset the watcher data for next time
      this.resetWatcher();

      if (shouldRebuild(watchResults)) {
        // kick off the rebuild
        rebuild(this.config, this.compilerCtx, watchResults);

      } else {
        // never was a change
        this.compilerCtx.events.emit('buildNoChange', { noChange: true });
      }

    } catch (e) {
      this.config.logger.error(`watcher, startRebuild`, e);
    }
  }

  queue() {
    clearTimeout(this.watchTmr);
    this.watchTmr = setTimeout(this.startRebuild.bind(this), 20);
  }

  resetWatcher() {
    this.dirsAdded = [];
    this.dirsDeleted = [];
    this.filesAdded = [];
    this.filesDeleted = [];
    this.filesUpdated = [];
    this.configUpdated = false;
    this.hasCopyChanges = false;
  }

}


const TXT_EXT = ['.ts', '.tsx', '.js', '.jsx', '.html', '.html', '.css', '.scss', '.pcss', '.styl', '.stylus', '.less', '.md', '.xml', '.svg', '.json', '.txt'];


function shouldRebuild(watcher: d.WatchResults) {
  return watcher.configUpdated ||
    watcher.hasCopyChanges ||
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
