import { CompilerSystem } from '../../declarations';
import { buildEvents } from '../../compiler/events';
import { createNodeSys } from './node-sys';
import { normalizePath } from '@utils';
import tsTypes from 'typescript';

export function createNodeSysWithWatch(prcs: NodeJS.Process): CompilerSystem {
  const ts = require('typescript') as typeof tsTypes;
  const sys = createNodeSys(prcs);
  const tsWatchFile = ts.sys.watchFile;
  const tsWatchDirectory = ts.sys.watchDirectory;

  sys.watchTimeout = 80;
  sys.events = buildEvents();

  sys.watchDirectory = (p, callback, recursive) => {
    const tsFileWatcher = tsWatchDirectory(
      p,
      fileName => {
        fileName = normalizePath(fileName);
        callback(fileName, null);
      },
      recursive,
    );

    const close = () => {
      tsFileWatcher.close();
    };

    sys.addDestory(close);

    return {
      close() {
        sys.removeDestory(close);
        tsFileWatcher.close();
      },
    };
  };

  sys.watchFile = (p, callback) => {
    const tsFileWatcher = tsWatchFile(p, (fileName, tsEventKind) => {
      fileName = normalizePath(fileName);
      if (tsEventKind === ts.FileWatcherEventKind.Created) {
        callback(fileName, 'fileAdd');
        sys.events.emit('fileAdd', fileName);
      } else if (tsEventKind === ts.FileWatcherEventKind.Changed) {
        callback(fileName, 'fileUpdate');
        sys.events.emit('fileUpdate', fileName);
      } else if (tsEventKind === ts.FileWatcherEventKind.Deleted) {
        callback(fileName, 'fileDelete');
        sys.events.emit('fileDelete', fileName);
      }
    });

    const close = () => {
      tsFileWatcher.close();
    };
    sys.addDestory(close);

    return {
      close() {
        sys.removeDestory(close);
        tsFileWatcher.close();
      },
    };
  };

  return sys;
}
