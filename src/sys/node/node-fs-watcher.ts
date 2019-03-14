import * as d from '../../declarations';
import { GENERATED_DTS } from '../../compiler/output-targets/output-utils';
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
  private dirItems = new Map<string, Set<string>>();

  constructor(private config: d.Config, private fs: d.FileSystem, private events: d.BuildEvents) {
  }

  async addDirectory(dirPath: string, emit = false) {
    const shouldQueue = await this.addDirectoryRecursive(dirPath, emit);

    if (emit && shouldQueue) {
      this.queue();
    }

    return shouldQueue;
  }

  private async addDirectoryRecursive(dirPath: string, emit = false) {
    dirPath = normalizePath(dirPath);

    if (this.shouldIgnore(dirPath)) {
      return false;
    }

    let hasChanges = false;
    if (emit && !this.dirsAdded.includes(dirPath)) {
      this.dirsAdded.push(dirPath);
      this.log('directory added', dirPath);
    }

    if (!this.dirWatchers.has(dirPath)) {
      const watcher = ts.sys.watchDirectory(dirPath, this.onDirectoryWatch.bind(this), false);
      this.dirWatchers.set(dirPath, watcher);
      hasChanges = true;
    }

    const subItems = await this.fs.readdir(dirPath);
    await Promise.all(subItems.map(async fileName => {
      const itemPath = path.join(dirPath, fileName);

      const stat = await this.fs.stat(itemPath);
      if (stat.isFile()) {
        const fileHasChanges = await this.addFile(itemPath, emit, false);
        if (fileHasChanges) {
          hasChanges = true;
        }

      } else if (stat.isDirectory()) {
        this.addDirItem(dirPath, itemPath);
        const dirHasChanges = await this.addDirectoryRecursive(itemPath, emit);
        if (dirHasChanges) {
          hasChanges = true;
        }
      }
    }));

    return hasChanges;
  }

  removeDirectory(dirPath: string, emit = false) {
    this.removeDirectoryRecursive(dirPath);

    if (emit && !this.dirsDeleted.includes(dirPath)) {
      this.log('directory deleted', dirPath);
      this.dirsDeleted.push(dirPath);
      this.queue();
    }
  }

  private removeDirectoryRecursive(dirPath: string) {
    dirPath = normalizePath(dirPath);

    const dirWatcher = this.dirWatchers.get(dirPath);
    if (dirWatcher != null) {
      this.dirWatchers.delete(dirPath);
      dirWatcher.close();
    }

    const fileWatcher = this.fileWatchers.get(dirPath);
    if (fileWatcher != null) {
      this.fileWatchers.delete(dirPath);
      fileWatcher.close();
    }

    const dirItems = this.dirItems.get(dirPath);
    if (dirItems != null) {
      dirItems.forEach(subDirItem => {
        this.removeDirectoryRecursive(subDirItem);
      });
      this.dirItems.delete(dirPath);
    }
  }

  private addDirItem(dirPath: string, dirItem: string) {
    const dirItems = this.dirItems.get(dirPath);
    if (dirItems == null) {
      this.dirItems.set(dirPath, new Set([dirItem]));
    } else {
      dirItems.add(dirItem);
    }
  }

  async addFile(filePath: string, emit = false, queue = true) {
    filePath = normalizePath(filePath);

    if (this.shouldIgnore(filePath)) {
      return false;
    }

    let hasChanges = false;
    if (!this.fileWatchers.has(filePath)) {
      const watcher = ts.sys.watchFile(filePath, this.onFileWatch.bind(this));
      this.fileWatchers.set(filePath, watcher);
      this.addDirItem(normalizePath(path.dirname(filePath)), filePath);
    }

    if (emit && !this.filesAdded.includes(filePath)) {
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
        this.filesAdded.push(filePath);

        if (queue) {
          this.queue();
        }
        hasChanges = true;
      }
    }

    return hasChanges;
  }

  removeFile(filePath: string, emit = false) {
    filePath = normalizePath(filePath);

    const watcher = this.fileWatchers.get(filePath);
    if (watcher != null) {
      this.fileWatchers.delete(filePath);
      watcher.close();
    }

    if (emit && !this.filesDeleted.includes(filePath)) {
      this.log('file deleted', filePath);

      this.filesDeleted.push(filePath);
      this.queue();
    }
  }

  async onFileChanged(fsPath: string) {
    fsPath = normalizePath(fsPath);

    if (this.filesUpdated.has(fsPath)) {
      this.log('file already queued to update', fsPath);
      return;
    }

    try {
      const buffer = await this.fs.readFile(fsPath);
      const hash = crypto
                    .createHash('md5')
                    .update(buffer)
                    .digest('base64');

      const existingHash = this.filesUpdated.get(fsPath);
      if (existingHash === hash) {
        this.log('file unchanged', fsPath);

      } else {
        this.log('file updated', fsPath);
        this.filesUpdated.set(fsPath, hash);
        this.queue();
      }

    } catch (e) {
      this.log(`onFileChanged: ${e}`, fsPath);
    }
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
        this.removeFile(fsPath, true);
        break;

      case ts.FileWatcherEventKind.Created:
        this.addFile(fsPath, true);
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
      this.log(`flush, empty queue`, this.config.rootDir);
      return;
    }

    // create the watch results from all that we've learned today
    const fsWatchResults: d.FsWatchResults = {
      dirsAdded: this.dirsAdded.slice(),
      dirsDeleted: this.dirsDeleted.slice(),
      filesAdded: this.filesAdded.slice(),
      filesDeleted: this.filesDeleted.slice(),
      filesUpdated: Array.from(this.filesUpdated.keys())
    };

    this.reset();

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
    clearTimeout(this.flushTmrId);
    this.reset();

    this.dirWatchers.forEach(watcher => {
      watcher.close();
    });
    this.dirWatchers.clear();

    this.fileWatchers.forEach(watcher => {
      watcher.close();
    });
    this.fileWatchers.clear();
  }

  private shouldIgnore(filePath: string) {
    for (let i = 0; i < IGNORES.length; i++) {
      if (filePath.endsWith(IGNORES[i])) {
        return true;
      }
    }

    if (this.config.watchIgnoredRegex != null) {
      if (this.config.watchIgnoredRegex.test(filePath)) {
        return true;
      }
    }
    return false;
  }

  private log(msg: string, filePath: string) {
    if (this.config.logger != null) {
      const relPath = path.relative(this.config.rootDir, filePath);
      this.config.logger.debug(`fs-watcher, ${msg}: ${relPath}, ${Date.now().toString().substring(6)}`);
    }
  }

}

const FLUSH_TIMEOUT = 50;

const IGNORES = [
  GENERATED_DTS,
  '.log',
  '.sql',
  '.sqlite',
  '.DS_Store',
  '.Spotlight-V100',
  '.Trashes',
  'ehthumbs.db',
  'Thumbs.db',
  '.gitignore',
  'package-lock.json'
];
