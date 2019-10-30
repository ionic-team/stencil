import { CompilerSystem } from '../../declarations';
import { createNodeSys } from './node-sys';
import { normalizePath } from '@utils';
import ts from 'typescript';


export function createNodeSysWithWatch(prcs: NodeJS.Process): CompilerSystem {
  const sys = createNodeSys(prcs);

  sys.fileWatchTimeout = 80;

  sys.watchDirectory = (p, callback) => {
    const tsFileWatcher = ts.sys.watchDirectory(p, (fileName) => {
      fileName = normalizePath(fileName);
      callback(fileName, null);
    }, true);

    const close = () => {
      tsFileWatcher.close();
    };

    sys.addDestory(close);

    return {
      close() {
        sys.removeDestory(close);
        tsFileWatcher.close();
      }
    };
  };

  sys.watchFile = (p, callback) => {
    const tsFileWatcher = ts.sys.watchFile(p, (fileName, tsEventKind) => {
      fileName = normalizePath(fileName);
      if (tsEventKind === ts.FileWatcherEventKind.Created) {
        callback(fileName, 'fileAdd');
      } else if (tsEventKind === ts.FileWatcherEventKind.Changed) {
        callback(fileName, 'fileUpdate');
      } else if (tsEventKind === ts.FileWatcherEventKind.Deleted) {
        callback(fileName, 'fileDelete');
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
      }
    };
  };

  return sys;
}
