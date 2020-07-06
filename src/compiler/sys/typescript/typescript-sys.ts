import type * as d from '../../../declarations';
import { basename } from 'path';
import { fetchUrlSync } from '../fetch/fetch-module-sync';
import { IS_CASE_SENSITIVE_FILE_NAMES, IS_WEB_WORKER_ENV, isRemoteUrl, isString, normalizePath } from '@utils';
import { TypeScriptModule } from './typescript-load';
import ts from 'typescript';

export const patchTypeScriptSys = (loadedTs: TypeScriptModule, config: d.Config, inMemoryFs: d.InMemoryFileSystem) => {
  loadedTs.sys = loadedTs.sys || ({} as ts.System);

  if (config.sys) {
    patchTsSystemFileSystem(config, config.sys, inMemoryFs, loadedTs.sys);
    patchTsSystemWatch(config.sys, loadedTs.sys);
  }
};

export const patchTsSystemFileSystem = (config: d.Config, stencilSys: d.CompilerSystem, inMemoryFs: d.InMemoryFileSystem, tsSys: ts.System) => {
  const realpath = (path: string) => {
    const rp = stencilSys.realpathSync(path);
    if (isString(rp)) {
      return rp;
    }
    return path;
  };

  const getAccessibleFileSystemEntries = (path: string) => {
    try {
      const entries = stencilSys.readdirSync(path || '.').sort();
      const files: string[] = [];
      const directories: string[] = [];

      for (const absPath of entries) {
        // This is necessary because on some file system node fails to exclude
        // "." and "..". See https://github.com/nodejs/node/issues/4002
        const stat = inMemoryFs.statSync(absPath);
        if (!stat) {
          continue;
        }

        const entry = basename(absPath);
        if (stat.isFile) {
          files.push(entry);
        } else if (stat.isDirectory) {
          directories.push(entry);
        }
      }
      return { files, directories };
    } catch (e) {
      return { files: [], directories: [] };
    }
  };

  tsSys.getCurrentDirectory = stencilSys.getCurrentDirectory;

  tsSys.createDirectory = p => {
    stencilSys.mkdirSync(p, { recursive: true });
  };

  tsSys.directoryExists = p => {
    const s = inMemoryFs.statSync(p);
    return s.isDirectory;
  };

  tsSys.exit = stencilSys.exit;

  tsSys.fileExists = p => {
    let filePath = p;

    if (isRemoteUrl(p)) {
      filePath = getTypescriptPathFromUrl(config, tsSys.getExecutingFilePath(), p);
    }

    const s = inMemoryFs.statSync(filePath);
    return !!(s && s.isFile);
  };

  tsSys.getDirectories = p => {
    const items = stencilSys.readdirSync(p);
    return items.filter(itemPath => {
      const s = inMemoryFs.statSync(itemPath);
      return !!(s && s.exists && s.isDirectory);
    });
  };

  tsSys.readDirectory = (path, extensions, exclude, include, depth) => {
    const cwd = stencilSys.getCurrentDirectory();
    return (ts as any).matchFiles(path, extensions, exclude, include, IS_CASE_SENSITIVE_FILE_NAMES, cwd, depth, getAccessibleFileSystemEntries, realpath);
  };

  tsSys.readFile = p => {
    let filePath = p;
    const isUrl = isRemoteUrl(p);

    if (isUrl) {
      filePath = getTypescriptPathFromUrl(config, tsSys.getExecutingFilePath(), p);
    }

    let content = inMemoryFs.readFileSync(filePath, { useCache: isUrl });

    if (typeof content !== 'string' && isUrl) {
      if (IS_WEB_WORKER_ENV) {
        content = fetchUrlSync(p);
        if (typeof content === 'string') {
          inMemoryFs.writeFile(filePath, content);
        }
      } else {
        config.logger.error(`ts.sys can only request http resources from within a web worker: ${p}`);
      }
    }

    return content;
  };

  tsSys.writeFile = (p, data) => inMemoryFs.writeFile(p, data);

  return tsSys;
};

const patchTsSystemWatch = (stencilSys: d.CompilerSystem, tsSys: ts.System) => {
  tsSys.watchDirectory = (p, cb, recursive) => {
    const watcher = stencilSys.watchDirectory(
      p,
      filePath => {
        cb(filePath);
      },
      recursive,
    );
    return {
      close() {
        watcher.close();
      },
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
      },
    };
  };
};

export const getTypescriptPathFromUrl = (config: d.Config, tsExecutingUrl: string, url: string) => {
  const tsBaseUrl = new URL('..', tsExecutingUrl).href;
  if (url.startsWith(tsBaseUrl)) {
    const tsFilePath = url.replace(tsBaseUrl, '/');
    const tsNodePath = config.sys.getLocalModulePath({ rootDir: config.rootDir, moduleId: 'typescript', path: tsFilePath });
    return normalizePath(tsNodePath);
  }
  return url;
};

export const patchTypeScriptGetParsedCommandLineOfConfigFile = (loadedTs: TypeScriptModule, _config: d.Config) => {
  const orgGetParsedCommandLineOfConfigFile = loadedTs.getParsedCommandLineOfConfigFile;

  loadedTs.getParsedCommandLineOfConfigFile = (configFileName, optionsToExtend, host, extendedConfigCache) => {
    const results = orgGetParsedCommandLineOfConfigFile(configFileName, optionsToExtend, host, extendedConfigCache);

    // manually filter out any .spec or .e2e files
    results.fileNames = results.fileNames.filter(f => {
      // filter e2e tests
      if (f.includes('.e2e.') || f.includes('/e2e.')) {
        return false;
      }
      // filter spec tests
      if (f.includes('.spec.') || f.includes('/spec.')) {
        return false;
      }
      return true;
    });

    return results;
  };
};
