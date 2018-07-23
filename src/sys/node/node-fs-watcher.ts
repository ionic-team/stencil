import * as d from '../../declarations';
import * as ts from 'typescript';
import { normalizePath } from '../../compiler/util';


export class FsWatcher implements d.FsWatcher {
  private dirsAdded: string[] = [];
  private dirsDeleted: string[] = [];
  private filesAdded: string[] = [];
  private filesDeleted: string[] = [];
  private filesUpdated: string[] = [];
  private flushTmrId: any;
  private fsItems = new Map<string, FsWatcherItem>();

  constructor(private fs: d.FileSystem, private logger: d.Logger, private events: d.BuildEvents) {

  }

  add(fsPath: string) {
    try {
      fsPath = normalizePath(fsPath);

      const stat = this.fs.statSync(fsPath);
      const fsItem: FsWatcherItem = {};

      if (stat.isDirectory()) {
        fsItem.isDirectory = true;
        fsItem.watcher = ts.sys.watchDirectory(fsPath, this.onDirectoryWatch.bind(this), true);
        this.fsItems.set(fsPath, fsItem);

      } else if (stat.isFile()) {
        fsItem.isDirectory = false;
        fsItem.watcher = ts.sys.watchFile(fsPath, this.onFileWatch.bind(this));
        this.fsItems.set(fsPath, fsItem);
      }

    } catch (e) {
      this.logger.error(`FsWatcher add: ${e}`);
    }
  }

  onDirectoryWatch(fsPath: string) {
    try {
      fsPath = normalizePath(fsPath);

      this.log('onDirectoryWatch', fsPath);

      const stat = this.fs.statSync(fsPath);
      const fsItem: FsWatcherItem = {};

      if (stat.isDirectory()) {
        if (!this.fsItems.has(fsPath)) {
          fsItem.isDirectory = true;
          fsItem.watcher = ts.sys.watchDirectory(fsPath, this.onDirectoryWatch.bind(this), true);
          this.fsItems.set(fsPath, fsItem);
        }

        if (!this.dirsAdded.includes(fsPath)) {
          this.log('directory added', fsPath);

          this.dirsAdded.push(fsPath);
          this.queue();
        }

      } else if (stat.isFile()) {
        if (!this.fsItems.has(fsPath)) {
          fsItem.isDirectory = false;
          fsItem.watcher = ts.sys.watchFile(fsPath, this.onFileWatch.bind(this));
          this.fsItems.set(fsPath, fsItem);
        }

        if (!this.filesAdded.push(fsPath)) {
          this.log('file added', fsPath);

          this.filesAdded.push(fsPath);
          this.queue();
        }
      }

    } catch (e) {

      const fsItem = this.fsItems.get(fsPath);
      if (fsItem) {
        if (fsItem.isDirectory) {
          fsItem.watcher && fsItem.watcher.close();
          this.fsItems.delete(fsPath);

          if (!this.dirsDeleted.push(fsPath)) {
            this.log('directory deleted', fsPath);

            this.dirsDeleted.push(fsPath);
            this.queue();
          }

        } else {
          fsItem.watcher && fsItem.watcher.close();
          this.fsItems.delete(fsPath);

          if (!this.filesDeleted.push(fsPath)) {
            this.log('file deleted', fsPath);

            this.filesDeleted.push(fsPath);
            this.queue();
          }
        }
      }
    }
  }

  private onFileWatch(fsPath: string, eventKind: ts.FileWatcherEventKind) {
    this.log('onFileWatch', fsPath);

    if (eventKind === ts.FileWatcherEventKind.Changed) {

    } else if (eventKind === ts.FileWatcherEventKind.Deleted) {

    } else if (eventKind === ts.FileWatcherEventKind.Created) {

    }
  }

  queue() {
    // let's chill out for a few moments to see if anything else
    // comes in as something that changed in the file system
    clearTimeout(this.flushTmrId);
    this.flushTmrId = setTimeout(this.flush.bind(this), FLUSH_TIMEOUT);
  }

  flush() {
    if (this.dirsAdded.length === 0 && this.dirsDeleted.length === 0 && this.filesAdded.length === 0 && this.filesDeleted.length === 0 && this.filesUpdated.length === 0) {
      return;
    }

    // create the watch results from all that we've learned today
    const fsWatchResults: d.FsWatchResults = {
      dirsAdded: this.dirsAdded.slice(),
      dirsDeleted: this.dirsDeleted.slice(),
      filesAdded: this.filesAdded.slice(),
      filesDeleted: this.filesDeleted.slice(),
      filesUpdated: this.filesUpdated.slice()
    };

    // send out the event of what we've learend
    this.events.emit('fsChange', fsWatchResults);
  }

  reset() {
    // reset the data for next time
    this.dirsAdded.length = 0;
    this.dirsDeleted.length = 0;
    this.filesAdded.length = 0;
    this.filesDeleted.length = 0;
    this.filesUpdated.length = 0;
  }

  close() {
    this.fsItems.forEach(fsItem => {
      fsItem.watcher && fsItem.watcher.close();
      fsItem.watcher = null;
    });
    this.fsItems.clear();
  }

  private log(msg: string, filePath: string) {
    this.logger.debug(`watch, ${msg}: ${filePath}, ${Date.now().toString().substring(5)}`);
  }

}


const FLUSH_TIMEOUT = 40;


interface FsWatcherItem {
  isDirectory?: boolean;
  watcher?: ts.FileWatcher;
}


export function createFsWatcher(fs: d.FileSystem, logger: d.Logger, events: d.BuildEvents, srcDir: string) {
  const fsWatcher = new FsWatcher(fs, logger, events);
  fsWatcher.add(srcDir);
  return fsWatcher;
}
