import type * as d from '../../declarations';
import { build } from './build';
import { BuildContext } from './build-ctx';
import { compilerRequest } from '../bundle/dev-module';
import { createTsWatchProgram } from '../transpile/create-watch-program';
import { dirname, resolve } from 'path';
import {
  filesChanged,
  hasHtmlChanges,
  hasScriptChanges,
  hasStyleChanges,
  isWatchIgnorePath,
  scriptsAdded,
  scriptsDeleted,
} from '../fs-watch/fs-watch-rebuild';
import { hasServiceWorkerChanges } from '../service-worker/generate-sw';
import { isString } from '@utils';
import type ts from 'typescript';

export const createWatchBuild = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx
): Promise<d.CompilerWatcher> => {
  let isRebuild = false;
  let tsWatchProgram: {
    program: ts.WatchOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram>;
    rebuild: () => void;
  };
  let closeResolver: Function;
  const watchWaiter = new Promise<d.WatcherCloseResults>((resolve) => (closeResolver = resolve));

  const dirsAdded = new Set<string>();
  const dirsDeleted = new Set<string>();
  const filesAdded = new Set<string>();
  const filesUpdated = new Set<string>();
  const filesDeleted = new Set<string>();

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
    const srcRead = watchSrcDirectory(config, compilerCtx);
    const otherRead = watchRootFiles(config, compilerCtx);
    await srcRead;
    await otherRead;
    tsWatchProgram = await createTsWatchProgram(config, onBuild);
    return watchWaiter;
  };

  const watchingDirs = new Map<string, d.CompilerFileWatcher>();
  const watchingFiles = new Map<string, d.CompilerFileWatcher>();

  const onFsChange: d.CompilerFileWatcherCallback = (p, eventKind) => {
    if (tsWatchProgram && !isWatchIgnorePath(config, p)) {
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

      config.logger.debug(`onFsChange ${eventKind}: ${p}`);
      tsWatchProgram.rebuild();
    }
  };

  const onDirChange: d.CompilerFileWatcherCallback = (p, eventKind) => {
    if (eventKind != null) {
      onFsChange(p, eventKind);
    }
  };

  const close = async () => {
    watchingDirs.forEach((w) => w.close());
    watchingFiles.forEach((w) => w.close());
    watchingDirs.clear();
    watchingFiles.clear();

    if (tsWatchProgram) {
      tsWatchProgram.program.close();
      tsWatchProgram = null;
    }

    const watcherCloseResults: d.WatcherCloseResults = {
      exitCode: 0,
    };
    closeResolver(watcherCloseResults);
    return watcherCloseResults;
  };

  const request = async (data: d.CompilerRequest) => compilerRequest(config, compilerCtx, data);

  compilerCtx.addWatchFile = (filePath) => {
    if (isString(filePath) && !watchingFiles.has(filePath) && !isWatchIgnorePath(config, filePath)) {
      watchingFiles.set(filePath, config.sys.watchFile(filePath, onFsChange));
    }
  };

  compilerCtx.addWatchDir = (dirPath, recursive) => {
    if (isString(dirPath) && !watchingDirs.has(dirPath) && !isWatchIgnorePath(config, dirPath)) {
      watchingDirs.set(dirPath, config.sys.watchDirectory(dirPath, onDirChange, recursive));
    }
  };

  config.sys.addDestory(close);

  return {
    start,
    close,
    on: compilerCtx.events.on,
    request,
  };
};

const watchSrcDirectory = async (config: d.Config, compilerCtx: d.CompilerCtx) => {
  const srcFiles = await compilerCtx.fs.readdir(config.srcDir, {
    recursive: true,
    excludeDirNames: ['.cache', '.git', '.github', '.stencil', '.vscode', 'node_modules'],
    excludeExtensions: [
      '.md',
      '.markdown',
      '.txt',
      '.spec.ts',
      '.spec.tsx',
      '.e2e.ts',
      '.e2e.tsx',
      '.gitignore',
      '.editorconfig',
    ],
  });

  srcFiles.filter(({ isFile }) => isFile).forEach(({ absPath }) => compilerCtx.addWatchFile(absPath));

  compilerCtx.addWatchDir(config.srcDir, true);
};

const watchRootFiles = async (config: d.Config, compilerCtx: d.CompilerCtx) => {
  // non-src files that cause a rebuild
  // mainly for root level config files, and getting an event when they change
  const rootFiles = await compilerCtx.fs.readdir(config.rootDir, {
    recursive: false,
    excludeDirNames: ['.cache', '.git', '.github', '.stencil', '.vscode', 'node_modules'],
  });

  rootFiles.filter(({ isFile }) => isFile).forEach(({ absPath }) => compilerCtx.addWatchFile(absPath));
};

const emitFsChange = (compilerCtx: d.CompilerCtx, buildCtx: BuildContext) => {
  if (
    buildCtx.dirsAdded.length > 0 ||
    buildCtx.dirsDeleted.length > 0 ||
    buildCtx.filesUpdated.length > 0 ||
    buildCtx.filesAdded.length > 0 ||
    buildCtx.filesDeleted.length > 0
  ) {
    compilerCtx.events.emit('fsChange', {
      dirsAdded: buildCtx.dirsAdded.slice(),
      dirsDeleted: buildCtx.dirsDeleted.slice(),
      filesUpdated: buildCtx.filesUpdated.slice(),
      filesAdded: buildCtx.filesAdded.slice(),
      filesDeleted: buildCtx.filesDeleted.slice(),
    });
  }
};

const updateCompilerCtxCache = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  path: string,
  kind: d.CompilerFileWatcherEvent
) => {
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
