import * as d from '@declarations';
import { logger } from '@sys';
import { normalizePath } from '@utils';
import crypto from 'crypto';
import path from 'path';
import ts from 'typescript';


export class FsWatcher implements d.FsWatcher {
  private dirsAdded: string[] = [];
  private dirsDeleted: string[] = [];
  private filesAdded: string[] = [];
  private filesDeleted: string[] = [];
  private filesUpdated = new Map<string, string>();
  private flushTmrId: any;
  private dirWatchers = new Map<string, d.FsWatcherItem>();
  private fileWatchers = new Map<string, d.FsWatcherItem>();

  constructor(private config: d.Config, private fs: d.FileSystem, private events: d.BuildEvents) {
    events.subscribe('buildFinish', this.reset.bind(this));
  }

  async addDirectory(dirPath: string, emit = false) {
    dirPath = normalizePath(dirPath);

    if (!this.dirWatchers.has(dirPath)) {
      const watcher = ts.sys.watchDirectory(dirPath, this.onDirectoryWatch.bind(this), true);
      this.dirWatchers.set(dirPath, watcher);
    }

    if (emit && !this.dirsAdded.includes(dirPath)) {
      this.log('directory added', dirPath);

      this.dirsAdded.push(dirPath);
      this.queue();
    }
  }

  removeDirectory(dirPath: string, emit = false) {
    dirPath = normalizePath(dirPath);

    const watcher = this.dirWatchers.get(dirPath);
    if (watcher) {
      this.dirWatchers.delete(dirPath);
      watcher.close();
    }

    if (emit && !this.dirsDeleted.push(dirPath)) {
      this.log('directory deleted', dirPath);

      this.dirsDeleted.push(dirPath);
      this.queue();
    }
  }

  async addFile(filePath: string, emit = false) {
    filePath = normalizePath(filePath);

    if (!this.fileWatchers.has(filePath)) {
      const watcher = ts.sys.watchFile(filePath, this.onFileWatch.bind(this));
      this.fileWatchers.set(filePath, watcher);
    }

    if (emit) {
      const buffer = await this.fs.readFile(filePath);
      const hash = crypto
                    .createHash('md5')
                    .update(buffer)
                    .digest('base64');

      const existingHash = this.filesUpdated.get(filePath);
      if (existingHash === hash) {
        this.log('file already added', filePath);

      } else {
        this.log('file added', filePath);
        this.filesUpdated.set(filePath, hash);
        this.queue();
      }
    }
  }

  removeFile(filePath: string, emit = false) {
    filePath = normalizePath(filePath);

    const watcher = this.fileWatchers.get(filePath);
    if (watcher) {
      this.fileWatchers.delete(filePath);
      watcher.close();
    }

    if (emit && !this.filesDeleted.push(filePath)) {
      this.log('file deleted', filePath);

      this.filesDeleted.push(filePath);
      this.queue();
    }
  }

  onFileChanged(fsPath: string) {
    fsPath = normalizePath(fsPath);
    this.log('onFileChanged', fsPath);

  }

  onFileDeleted(fsPath: string) {
    fsPath = normalizePath(fsPath);
    this.log('onFileDeleted', fsPath);

  }

  onFileCreated(fsPath: string) {
    fsPath = normalizePath(fsPath);
    this.log('onFileCreated', fsPath);

  }

  async onDirectoryWatch(fsPath: string) {
    fsPath = normalizePath(fsPath);

    const dirWatcher = this.dirWatchers.get(fsPath);
    if (dirWatcher != null) {
      // already a directory we're watching
      try {
        await this.fs.access(fsPath);
        // and there's still access, so do nothing
      } catch (e) {
        // but there's no longer access
        // so let's remove it
        this.removeDirectory(fsPath, true);
      }
      return;
    }

    const fileWatcher = this.fileWatchers.get(fsPath);
    if (fileWatcher != null) {
      // already a file we're watching
      try {
        await this.fs.access(fsPath);
        // and there's still access, so do nothing
      } catch (e) {
        // but there's no longer access
        // so let's remove it
        this.removeFile(fsPath, true);
      }
      return;
    }

    try {
      // not already a known watcher
      const stat = await this.fs.stat(fsPath);

      if (stat.isDirectory()) {
        this.addDirectory(fsPath, true);

      } else if (stat.isFile()) {
        this.addFile(fsPath, true);
      }

    } catch (e) {
      this.log('onDirectoryWatch, no access', fsPath);
    }
  }

  onFileWatch(fsPath: string, fsEvent: ts.FileWatcherEventKind) {
    switch (fsEvent) {
      case ts.FileWatcherEventKind.Changed:
        this.onFileChanged(fsPath);
        break;

      case ts.FileWatcherEventKind.Deleted:
        this.onFileDeleted(fsPath);
        break;

      case ts.FileWatcherEventKind.Created:
        this.onFileCreated(fsPath);
        break;

      default:
        this.log(`onFileWatch, unknown event: ${fsEvent}`, fsPath);
    }
  }

  queue() {
    // let's chill out for a few moments to see if anything else
    // comes in as something that changed in the file system
    clearTimeout(this.flushTmrId);
    this.flushTmrId = setTimeout(this.flush.bind(this), FLUSH_TIMEOUT);
  }

  flush() {
    if (this.dirsAdded.length === 0 && this.dirsDeleted.length === 0 && this.filesAdded.length === 0 && this.filesDeleted.length === 0 && this.filesUpdated.size === 0) {
      return;
    }

    // create the watch results from all that we've learned today
    const fsWatchResults: d.FsWatchResults = {
      dirsAdded: this.dirsAdded.slice(),
      dirsDeleted: this.dirsDeleted.slice(),
      filesAdded: this.filesAdded.slice(),
      filesDeleted: this.filesDeleted.slice(),
      filesUpdated: []
    };

    for (const key in this.filesUpdated.keys()) {
      fsWatchResults.filesUpdated.push(key);
    }

    // send out the event of what we've learend
    this.events.emit('fsChange', fsWatchResults);
  }

  reset() {
    // reset the data for next time
    this.dirsAdded.length = 0;
    this.dirsDeleted.length = 0;
    this.filesAdded.length = 0;
    this.filesDeleted.length = 0;
    this.filesUpdated.clear();
  }

  close() {
    this.dirWatchers.forEach(watcher => {
      watcher.close();
    });
    this.dirWatchers.clear();

    this.fileWatchers.forEach(watcher => {
      watcher.close();
    });
    this.fileWatchers.clear();
  }

  private log(msg: string, filePath: string) {
    const relPath = path.relative(this.config.rootDir, filePath);
    logger.debug(`fs-watch, ${msg}: ${relPath}, ${Date.now().toString().substring(6)}`);
  }

}

const FLUSH_TIMEOUT = 50;
