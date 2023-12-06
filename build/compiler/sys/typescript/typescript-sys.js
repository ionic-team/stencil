import { isRemoteUrl, isString, noop, normalizePath, resolve } from '@utils';
import { basename } from 'path';
import ts from 'typescript';
import { IS_CASE_SENSITIVE_FILE_NAMES } from '../environment';
// TODO(STENCIL-728): fix typing of `inMemoryFs` parameter in `patchTypescript`, related functions
export const patchTsSystemFileSystem = (config, compilerSys, inMemoryFs, tsSys) => {
    const realpath = (path) => {
        const rp = compilerSys.realpathSync(path);
        if (isString(rp)) {
            return rp;
        }
        return path;
    };
    const getAccessibleFileSystemEntries = (path) => {
        try {
            const entries = compilerSys.readDirSync(path || '.').sort();
            const files = [];
            const directories = [];
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
                }
                else if (stat.isDirectory) {
                    directories.push(entry);
                }
            }
            return { files, directories };
        }
        catch (e) {
            return { files: [], directories: [] };
        }
    };
    tsSys.createDirectory = (p) => {
        compilerSys.createDirSync(p, { recursive: true });
    };
    tsSys.directoryExists = (p) => {
        // At present the typing for `inMemoryFs` in this function is not accurate
        // TODO(STENCIL-728): fix typing of `inMemoryFs` parameter in `patchTypescript`, related functions
        if (inMemoryFs) {
            const s = inMemoryFs.statSync(p);
            return s.isDirectory;
        }
        else {
            const s = compilerSys.statSync(p);
            return s.isDirectory;
        }
    };
    tsSys.exit = compilerSys.exit;
    tsSys.fileExists = (p) => {
        let filePath = p;
        if (isRemoteUrl(p)) {
            filePath = getTypescriptPathFromUrl(config, tsSys.getExecutingFilePath(), p);
        }
        // At present the typing for `inMemoryFs` in this function is not accurate
        // TODO(STENCIL-728): fix typing of `inMemoryFs` parameter in `patchTypescript`, related functions
        if (inMemoryFs) {
            const s = inMemoryFs.statSync(filePath);
            return !!(s && s.isFile);
        }
        else {
            const s = compilerSys.statSync(filePath);
            return !!(s && s.isFile);
        }
    };
    tsSys.getCurrentDirectory = compilerSys.getCurrentDirectory;
    tsSys.getExecutingFilePath = compilerSys.getCompilerExecutingPath;
    tsSys.getDirectories = (p) => {
        const items = compilerSys.readDirSync(p);
        return items.filter((itemPath) => {
            // At present the typing for `inMemoryFs` in this function is not accurate
            // TODO(STENCIL-728): fix typing of `inMemoryFs` parameter in `patchTypescript`, related functions
            if (inMemoryFs) {
                const s = inMemoryFs.statSync(itemPath);
                return !!(s && s.exists && s.isDirectory);
            }
            else {
                const s = compilerSys.statSync(itemPath);
                return !!(s && s.isDirectory);
            }
        });
    };
    tsSys.readDirectory = (path, extensions, exclude, include, depth) => {
        const cwd = compilerSys.getCurrentDirectory();
        // TODO(STENCIL-344): Replace `matchFiles` with a function that is publicly exposed
        return ts.matchFiles(path, extensions, exclude, include, IS_CASE_SENSITIVE_FILE_NAMES, cwd, depth, getAccessibleFileSystemEntries, realpath);
    };
    tsSys.readFile = (filePath) => {
        return inMemoryFs ? inMemoryFs.readFileSync(filePath, { useCache: false }) : compilerSys.readFileSync(filePath);
    };
    // At present the typing for `inMemoryFs` in this function is not accurate
    // TODO(STENCIL-728): fix typing of `inMemoryFs` parameter in `patchTypescript`, related functions
    tsSys.writeFile = (p, data) => (inMemoryFs ? inMemoryFs.writeFile(p, data) : compilerSys.writeFile(p, data));
    return tsSys;
};
const patchTsSystemWatch = (compilerSystem, tsSys) => {
    tsSys.watchDirectory = (p, cb, recursive) => {
        const watcher = compilerSystem.watchDirectory(p, (filePath) => {
            cb(filePath);
        }, recursive);
        return {
            close() {
                watcher.close();
            },
        };
    };
    tsSys.watchFile = (p, cb) => {
        const watcher = compilerSystem.watchFile(p, (filePath, eventKind) => {
            if (eventKind === 'fileAdd') {
                cb(filePath, ts.FileWatcherEventKind.Created);
            }
            else if (eventKind === 'fileUpdate') {
                cb(filePath, ts.FileWatcherEventKind.Changed);
            }
            else if (eventKind === 'fileDelete') {
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
// TODO(STENCIL-728): fix typing of `inMemoryFs` parameter in `patchTypescript`, related functions
export const patchTypescript = (config, inMemoryFs) => {
    if (!ts.__patched) {
        patchTsSystemFileSystem(config, config.sys, inMemoryFs, ts.sys);
        patchTsSystemWatch(config.sys, ts.sys);
        ts.__patched = true;
    }
};
const patchTypeScriptSysMinimum = () => {
    if (!ts.sys) {
        // patches just the bare minimum
        // if ts.sys already exists then it must be node ts.sys
        // otherwise we're browser
        // will be updated later on with the stencil sys
        ts.sys = {
            args: [],
            createDirectory: noop,
            directoryExists: () => false,
            exit: noop,
            fileExists: () => false,
            getCurrentDirectory: process.cwd,
            getDirectories: () => [],
            getExecutingFilePath: () => './',
            readDirectory: () => [],
            readFile: noop,
            newLine: '\n',
            resolvePath: resolve,
            useCaseSensitiveFileNames: false,
            write: noop,
            writeFile: noop,
        };
    }
};
patchTypeScriptSysMinimum();
export const getTypescriptPathFromUrl = (config, tsExecutingUrl, url) => {
    const tsBaseUrl = new URL('..', tsExecutingUrl).href;
    if (url.startsWith(tsBaseUrl)) {
        const tsFilePath = url.replace(tsBaseUrl, '/');
        const tsNodePath = config.sys.getLocalModulePath({
            rootDir: config.rootDir,
            moduleId: '@stencil/core',
            path: tsFilePath,
        });
        return normalizePath(tsNodePath);
    }
    return url;
};
//# sourceMappingURL=typescript-sys.js.map