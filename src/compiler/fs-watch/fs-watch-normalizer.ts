import * as d from '@declarations';
import { GENERATED_DTS } from '../app/app-file-naming';
import { normalizePath } from '@stencil/core/utils';


export class FsWatchNormalizer {
  private dirsAdded: string[] = [];
  private dirsDeleted: string[] = [];
  private filesAdded: string[] = [];
  private filesDeleted: string[] = [];
  private filesUpdated: string[] = [];
  private flushTmrId: any;

  constructor(private config: d.Config, private events: d.BuildEvents) {}

  fileUpdate(filePath: string) {
    filePath = normalizePath(filePath);
    if (shouldIgnore(filePath)) {
      return;
    }

    if (!this.filesUpdated.includes(filePath)) {
      this.log('file updated', filePath);

      this.filesUpdated.push(filePath);
      this.queue();
    }
  }

  fileAdd(filePath: string) {
    filePath = normalizePath(filePath);
    if (shouldIgnore(filePath)) {
      return;
    }

    if (!this.filesAdded.includes(filePath)) {
      this.log('file added', filePath);

      this.filesAdded.push(filePath);
      this.queue();
    }
  }

  fileDelete(filePath: string) {
    filePath = normalizePath(filePath);
    if (shouldIgnore(filePath)) {
      return;
    }

    if (!this.filesDeleted.includes(filePath)) {
      this.log('file deleted', filePath);

      this.filesDeleted.push(filePath);
      this.queue();
    }
  }

  dirAdd(dirPath: string) {
    dirPath = normalizePath(dirPath);

    if (!this.dirsAdded.includes(dirPath)) {
      this.log('directory added', dirPath);

      this.dirsAdded.push(dirPath);
      this.queue();
    }
  }

  dirDelete(dirPath: string) {
    dirPath = normalizePath(dirPath);

    if (!this.dirsDeleted.includes(dirPath)) {
      this.log('directory deleted', dirPath);

      this.dirsDeleted.push(dirPath);
      this.queue();
    }
  }

  queue() {
    // let's chill out for a few moments to see if anything else
    // comes in as something that changed in the file system
    clearTimeout(this.flushTmrId);
    this.flushTmrId = setTimeout(this.flush.bind(this), 40);
  }

  flush() {
    // create the watch results from all that we've learned today
    const fsWatchResults: d.FsWatchResults = {
      dirsAdded: this.dirsAdded.slice(),
      dirsDeleted: this.dirsDeleted.slice(),
      filesAdded: this.filesAdded.slice(),
      filesDeleted: this.filesDeleted.slice(),
      filesUpdated: this.filesUpdated.slice()
    };

    // reset the data for next time
    this.dirsAdded.length = 0;
    this.dirsDeleted.length = 0;
    this.filesAdded.length = 0;
    this.filesDeleted.length = 0;
    this.filesUpdated.length = 0;

    // send out the event of what we've learend
    this.events.emit('fsChange', fsWatchResults);
  }

  subscribe() {
    this.events.subscribe('fileUpdate', this.fileUpdate.bind(this));
    this.events.subscribe('fileAdd', this.fileAdd.bind(this));
    this.events.subscribe('fileDelete', this.fileDelete.bind(this));
    this.events.subscribe('dirAdd', this.dirAdd.bind(this));
    this.events.subscribe('dirDelete', this.dirDelete.bind(this));
  }

  private log(msg: string, filePath: string) {
    const relPath = this.config.sys.path.relative(this.config.rootDir, filePath);
    this.config.logger.debug(`watch, ${msg}: ${relPath}, ${Date.now().toString().substring(5)}`);
  }

}


function shouldIgnore(filePath: string) {
  return filePath.endsWith(GENERATED_DTS);
}
