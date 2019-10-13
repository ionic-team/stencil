import * as d from '../../../declarations';
import { dependencies, getRemoteDependencyUrl } from '../dependencies';
import { fetchUrlSync } from '../fetch/fetch-module-sync';
import { IS_WEB_WORKER_ENV } from '../environment';
import path from 'path';
import ts from 'typescript';


export const getTypeScriptSys = (config: d.Config, inMemoryFs: d.InMemoryFileSystem) => {
  const stencilSys = config.sys_next;
  const tsSys = Object.assign({}, ts.sys || {} as ts.System);

  patchTsSystemFileSystem(config, stencilSys, inMemoryFs, tsSys);
  patchTsSystemWatch(stencilSys, tsSys);
  patchTsSystemUtils(config, tsSys);

  return tsSys;
};


const patchTsSystemFileSystem = (config: d.Config, stencilSys: d.CompilerSystem, inMemoryFs: d.InMemoryFileSystem, tsSys: ts.System) => {

  tsSys.createDirectory = (p) => stencilSys.mkdirSync(p);

  tsSys.directoryExists = (p) => {
    const s = inMemoryFs.statSync(p);
    return s.isDirectory;
  };

  tsSys.directoryExists = (p) => {
    const s = inMemoryFs.statSync(p);
    return s.isDirectory;
  };

  tsSys.fileExists = (p) => {
    const s = inMemoryFs.statSync(p);
    return s.isFile;
  };

  tsSys.getDirectories = (p) => {
    const items = stencilSys.readdirSync(p);
    return items.filter(itemPath => {
      const s = stencilSys.statSync(itemPath);
      return !!(s && s.isDirectory());
    });
  };

  const visitDirectory = (matchingPaths: Set<string>, p: string, extensions: ReadonlyArray<string>) => {
    const dirItems = stencilSys.readdirSync(p);

    dirItems.forEach(dirItem => {
      if (Array.isArray(extensions) && extensions.length > 0) {
        if (extensions.some(ext => dirItem.endsWith(ext))) {
          matchingPaths.add(dirItem);
        }
      } else {
        matchingPaths.add(dirItem);
      }

      const s = stencilSys.statSync(dirItem);
      if (s && s.isDirectory()) {
        visitDirectory(matchingPaths, dirItem, extensions);
      }
    });
  };

  tsSys.readDirectory = (p, extensions) => {
    const matchingPaths = new Set<string>();
    visitDirectory(matchingPaths, p, extensions);
    return Array.from(matchingPaths);
  };

  tsSys.readFile = (p) => {
    let content = inMemoryFs.readFileSync(p);

    if (typeof content !== 'string' && (p.startsWith('https:') || p.startsWith('http:'))) {
      if (IS_WEB_WORKER_ENV) {
        content = fetchUrlSync(p);
        if (typeof content === 'string') {
          stencilSys.writeFileSync(p, content);
        }
      } else {
        config.logger.error(`ts.sys can only request http resources from within a web worker: ${p}`);
      }
    }

    return content;
  };

  tsSys.writeFile = (p, data) => {
    inMemoryFs.writeFile(p, data);
    stencilSys.writeFileSync(p, data);
  };
};


const patchTsSystemWatch = (stencilSys: d.CompilerSystem, tsSys: ts.System) => {

  if (!tsSys.watchDirectory) {
    tsSys.watchDirectory = (p, cb) => {
      const watcher = stencilSys.watchDirectory(p, (filePath) => {
        cb(filePath);
      });
      return {
        close() {
          watcher.close();
        }
      };
    };
  }

  if (!tsSys.watchFile) {
    tsSys.watchFile = (p, cb) => {
      const watcher = stencilSys.watchFile(p, (filePath, eventKind) => {
        if (eventKind === 'fileAdd') {
          cb(filePath, ts.FileWatcherEventKind.Created);
        } else if (eventKind === 'fileUpdate') {
          cb(filePath, ts.FileWatcherEventKind.Changed);
        } else if (eventKind === 'fileDelete') {
          cb(filePath, ts.FileWatcherEventKind.Deleted);
        }
      });
      return {
        close() {
          watcher.close();
        }
      };
    };
  }

};


const patchTsSystemUtils = (config: d.Config, tsSys: ts.System) => {
  if (!tsSys.getExecutingFilePath) {
    const tsDep = dependencies.find(dep => dep.name === 'typescript');
    const tsUrl = getRemoteDependencyUrl(tsDep);
    tsSys.getExecutingFilePath = () => {
      return tsUrl;
    };
  }

  if (!tsSys.getCurrentDirectory) {
    tsSys.getCurrentDirectory = () => {
      return '/';
    };
  }

  if (!tsSys.args) {
    tsSys.args = [];
  }

  if (!tsSys.newLine) {
    tsSys.newLine = '\n';
  }

  if (typeof tsSys.useCaseSensitiveFileNames !== 'boolean') {
    tsSys.useCaseSensitiveFileNames = false;
  }

  if (!tsSys.exit) {
    tsSys.exit = (exitCode) => {
      config.logger.error(`typescript exit: ${exitCode}`);
    };
  }

  if (!tsSys.resolvePath) {
    tsSys.resolvePath = (p) => {
      return path.resolve(p);
    };
  }

  if (!tsSys.write) {
    tsSys.write = (s) => {
      config.logger.info('ts.sys.write', s);
    };
  }
};
