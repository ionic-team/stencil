import * as d from '../../../declarations';
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

  // const skipDirectories = (p: string) => {
  //   return (
  //     !p.startsWith(config.rootDir)
  //   );
  // };

  // const filterTypes = (paths: string[]) => paths.filter(p => (
  //   !p.includes('/@types/puppeteer') &&
  //   !p.includes('/@types/jest') &&
  //   !p.includes('/@types/node') &&
  //   !p.includes('/@types/estree')
  // ));

  const skipFile = (readPath: string) => {
    // filter e2e tests
    if (readPath.includes('.e2e.') || readPath.includes('/e2e.')) {
      // keep this test if it's an e2e file and we should be testing e2e
      return true;
    }

    // filter spec tests
    if (readPath.includes('.spec.') || readPath.includes('/spec.')) {
      return true;
    }
    return false;
  };

  tsSys.createDirectory = (p) => stencilSys.mkdirSync(p);

  tsSys.directoryExists = (p) => {
    if (skipFile(p)) {
      return false;
    }
    const s = inMemoryFs.statSync(p);
    return s.isDirectory;
  };

  tsSys.fileExists = (p) => {
    if (skipFile(p)) {
      return false;
    }
    const s = inMemoryFs.statSync(p);
    return s.isFile;
  };

  tsSys.getDirectories = (p) => {
    // if (skipDirectories(p)) {
    //   return [];
    // }
    const items = stencilSys.readdirSync(p);
    return items.filter(itemPath => {
      const s = stencilSys.statSync(itemPath);
      return !!(s && s.isDirectory());
    });
  };

  const visitDirectory = (matchingPaths: Set<string>, p: string, extensions: ReadonlyArray<string>, depth: number) => {
    if (depth !== undefined) {
      depth--;
      if (depth === 0) {
        return;
      }
    }
    const dirItems = stencilSys.readdirSync(p);

    dirItems.forEach(dirItem => {
      if (!skipFile(dirItem)) {
        if (Array.isArray(extensions) && extensions.length > 0) {
          if (extensions.some(ext => dirItem.endsWith(ext))) {
            matchingPaths.add(dirItem);
          }
        } else {
          matchingPaths.add(dirItem);
        }

        const s = inMemoryFs.statSync(dirItem);
        if (s && s.isDirectory) {
          visitDirectory(matchingPaths, dirItem, extensions, depth);
        }
      }
    });
  };

  tsSys.readDirectory = (p, extensions, _exclude, _include, depth) => {
    // if (skipDirectories(p)) {
    //   return [];
    // }
    const matchingPaths = new Set<string>();
    visitDirectory(matchingPaths, p, extensions, depth);
    return Array.from(matchingPaths);
  };

  tsSys.readFile = (p) => {
    if (skipFile(p)) {
      return undefined;
    }
    let content = inMemoryFs.readFileSync(p, {useCache: false});

    if (typeof content !== 'string' && (p.startsWith('https:') || p.startsWith('http:'))) {
      if (IS_WEB_WORKER_ENV) {
        content = fetchUrlSync(p);
        if (typeof content === 'string') {
          inMemoryFs.writeFile(p, content);
        }
      } else {
        config.logger.error(`ts.sys can only request http resources from within a web worker: ${p}`);
      }
    }

    return content;
  };

  tsSys.writeFile = (p, data) => {
    inMemoryFs.writeFile(p, data);
  };
};


const patchTsSystemWatch = (stencilSys: d.CompilerSystem, tsSys: ts.System) => {

  tsSys.watchDirectory = (p, cb, recursive) => {
    const watcher = stencilSys.watchDirectory(p, (filePath) => {
      cb(filePath);
    }, recursive);
    return {
      close() {
        watcher.close();
      }
    };
  };

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

};


const patchTsSystemUtils = (config: d.Config, tsSys: ts.System) => {
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
