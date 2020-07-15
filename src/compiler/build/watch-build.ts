import type * as d from '../../declarations';
import { build } from './build';
import { BuildContext } from './build-ctx';
import { compilerRequest } from '../bundle/dev-module';
import { createTsWatchProgram } from '../transpile/create-watch-program';
import { dirname, resolve } from 'path';
import { filesChanged, hasHtmlChanges, hasScriptChanges, hasStyleChanges, scriptsAdded, scriptsDeleted } from '../fs-watch/fs-watch-rebuild';
import { hasServiceWorkerChanges } from '../service-worker/generate-sw';
import type ts from 'typescript';

export const createWatchBuild = async (config: d.Config, compilerCtx: d.CompilerCtx): Promise<d.CompilerWatcher> => {
  let isRebuild = false;
  let tsWatchProgram: { program: ts.WatchOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram>; rebuild: () => void };
  let srcFileWatchCloser: () => void;
  let otherFileWatchCloser: () => void;

  let closeResolver: Function;
  const watchWaiter = new Promise<d.WatcherCloseResults>(resolve => (closeResolver = resolve));

  const dirsAdded = new Set<string>();
  const dirsDeleted = new Set<string>();
  const filesAdded = new Set<string>();
  const filesUpdated = new Set<string>();
  const filesDeleted = new Set<string>();

  const onSrcFileChange: d.CompilerFileWatcherCallback = (p, eventKind) => {
    updateCompilerCtxCache(config, compilerCtx, p, eventKind);

    switch (eventKind) {
      case 'dirAdd':
        dirsAdded.add(p);
        break;
      case 'dirDelete':
        dirsDeleted.add(p);
        break;
      case 'fileAdd':
        filesAdded.add(p);
        break;
      case 'fileUpdate':
        filesUpdated.add(p);
        break;
      case 'fileDelete':
        filesDeleted.add(p);
        break;
    }

    config.logger.debug(`${eventKind}: ${p}`);
    tsWatchProgram.rebuild();
  };

  const onBuild = async (tsBuilder: ts.BuilderProgram) => {
    const buildCtx = new BuildContext(config, compilerCtx);
    buildCtx.isRebuild = isRebuild;
    buildCtx.requiresFullBuild = !isRebuild;
    buildCtx.dirsAdded = Array.from(dirsAdded.keys()).sort();
    buildCtx.dirsDeleted = Array.from(dirsDeleted.keys()).sort();
    buildCtx.filesAdded = Array.from(filesAdded.keys()).sort();
    buildCtx.filesUpdated = Array.from(filesUpdated.keys()).sort();
    buildCtx.filesDeleted = Array.from(filesDeleted.keys()).sort();
    buildCtx.filesChanged = filesChanged(buildCtx);
    buildCtx.scriptsAdded = scriptsAdded(buildCtx);
    buildCtx.scriptsDeleted = scriptsDeleted(buildCtx);
    buildCtx.hasScriptChanges = hasScriptChanges(buildCtx);
    buildCtx.hasStyleChanges = hasStyleChanges(buildCtx);
    buildCtx.hasHtmlChanges = hasHtmlChanges(config, buildCtx);
    buildCtx.hasServiceWorkerChanges = hasServiceWorkerChanges(config, buildCtx);

    dirsAdded.clear();
    dirsDeleted.clear();
    filesAdded.clear();
    filesUpdated.clear();
    filesDeleted.clear();

    emitFsChange(compilerCtx, buildCtx);

    buildCtx.start();

    const result = await build(config, compilerCtx, buildCtx, tsBuilder);

    if (result && !result.hasError) {
      isRebuild = true;
    }
  };

  const start = async () => {
    const srcRead = watchSrcDirectory(config, compilerCtx, onSrcFileChange);
    const otherRead = watchOtherFiles(config, compilerCtx);
    srcFileWatchCloser = await srcRead;
    otherFileWatchCloser = await otherRead;
    tsWatchProgram = await createTsWatchProgram(config, onBuild);
    return watchWaiter;
  };

  const close = async () => {
    if (srcFileWatchCloser) {
      srcFileWatchCloser();
    }
    if (otherFileWatchCloser) {
      otherFileWatchCloser();
    }
    if (tsWatchProgram) {
      tsWatchProgram.program.close();
    }

    srcFileWatchCloser = otherFileWatchCloser = tsWatchProgram = null;

    const watcherCloseResults: d.WatcherCloseResults = {
      exitCode: 0,
    };
    closeResolver(watcherCloseResults);
    return watcherCloseResults;
  };

  const request = async (data: d.CompilerRequest) => compilerRequest(config, compilerCtx, data);

  config.sys.addDestory(close);

  return {
    start,
    close,
    on: compilerCtx.events.on,
    request,
  };
};

const watchSrcDirectory = async (config: d.Config, compilerCtx: d.CompilerCtx, callback: d.CompilerFileWatcherCallback) => {
  const watching = new Map();
  const watchFile = (path: string) => {
    if (!watching.has(path)) {
      watching.set(path, config.sys.watchFile(path, callback));
    }
  };

  const srcFiles = await compilerCtx.fs.readdir(config.srcDir, {
    recursive: true,
    excludeDirNames: ['.cache', '.git', '.github', '.stencil', '.vscode', 'node_modules'],
    excludeExtensions: ['.md', '.markdown', '.txt', '.spec.ts', '.spec.tsx', '.e2e.ts', '.e2e.tsx', '.gitignore', '.editorconfig'],
  });

  srcFiles.filter(({ isFile }) => isFile).forEach(({ absPath }) => watchFile(absPath));

  watching.set(
    config.srcDir,
    config.sys.watchDirectory(config.srcDir, (filename, kind) => {
      if (kind != null) {
        watchFile(filename);
        callback(filename, kind);
      }
    }),
  );

  return () => {
    watching.forEach(w => w.close());
  };
};

const watchOtherFiles = async (config: d.Config, compilerCtx: d.CompilerCtx) => {
  // non-src files that cause a rebuild
  // mainly for root level config files, and getting an event when they change
  const onFileChange: d.CompilerFileWatcherCallback = (p, eventKind) => {
    const data: d.FsWatchResults = {
      dirsAdded: [],
      dirsDeleted: [],
      filesUpdated: [],
      filesAdded: [],
      filesDeleted: [],
    };

    switch (eventKind) {
      case 'dirAdd':
        data.dirsAdded.push(p);
        break;
      case 'dirDelete':
        data.dirsDeleted.push(p);
        break;
      case 'fileAdd':
        data.filesAdded.push(p);
        break;
      case 'fileUpdate':
        data.filesUpdated.push(p);
        break;
      case 'fileDelete':
        data.filesDeleted.push(p);
        break;
    }

    compilerCtx.events.emit('fsChange', data);
  };
  const watching = new Map();
  const watchFile = (path: string) => {
    if (!watching.has(path)) {
      watching.set(path, config.sys.watchFile(path, onFileChange));
    }
  };

  const rootFiles = await compilerCtx.fs.readdir(config.rootDir, {
    recursive: false,
    excludeDirNames: ['.cache', '.git', '.github', '.stencil', '.vscode', 'node_modules'],
  });

  rootFiles.filter(({ isFile }) => isFile).forEach(({ absPath }) => watchFile(absPath));

  return () => {
    watching.forEach(w => w.close());
  };
};

const emitFsChange = (compilerCtx: d.CompilerCtx, buildCtx: BuildContext) => {
  if (buildCtx.dirsAdded.length > 0 || buildCtx.dirsDeleted.length > 0 || buildCtx.filesUpdated.length > 0 || buildCtx.filesAdded.length > 0 || buildCtx.filesDeleted.length > 0) {
    compilerCtx.events.emit('fsChange', {
      dirsAdded: buildCtx.dirsAdded.slice(),
      dirsDeleted: buildCtx.dirsDeleted.slice(),
      filesUpdated: buildCtx.filesUpdated.slice(),
      filesAdded: buildCtx.filesAdded.slice(),
      filesDeleted: buildCtx.filesDeleted.slice(),
    });
  }
};

const updateCompilerCtxCache = (config: d.Config, compilerCtx: d.CompilerCtx, path: string, kind: d.CompilerFileWatcherEvent) => {
  compilerCtx.fs.clearFileCache(path);
  compilerCtx.changedFiles.add(path);

  if (kind === 'fileDelete') {
    compilerCtx.moduleMap.delete(path);
  } else if (kind === 'dirDelete') {
    const fsRootDir = resolve('/');
    compilerCtx.moduleMap.forEach((_, moduleFilePath) => {
      let moduleAncestorDir = dirname(moduleFilePath);

      for (let i = 0; i < 50; i++) {
        if (moduleAncestorDir === config.rootDir || moduleAncestorDir === fsRootDir) {
          break;
        }

        if (moduleAncestorDir === path) {
          compilerCtx.fs.clearFileCache(moduleFilePath);
          compilerCtx.moduleMap.delete(moduleFilePath);
          compilerCtx.changedFiles.add(moduleFilePath);
          break;
        }

        moduleAncestorDir = dirname(moduleAncestorDir);
      }
    });
  }
};
