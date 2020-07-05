import { BuildCtx, Cache, CompilerCtx, CompilerSystem, Config } from '@stencil/core/internal';
import { BuildContext } from '../compiler/build/build-ctx';
import { Cache as CompilerCache } from '../compiler/cache';
import { createInMemoryFs } from '../compiler/sys/in-memory-fs';
import { createTestingSystem } from './testing-sys';
import { createWorkerContext } from '@stencil/core/compiler';
import { MockWindow } from '@stencil/core/mock-doc';
import { TestingLogger } from './testing-logger';
import path from 'path';

export function mockConfig(sys?: CompilerSystem) {
  const rootDir = path.resolve('/');

  if (!sys) {
    sys = createTestingSystem();
  }
  sys.getCurrentDirectory = () => rootDir;

  const config: Config = {
    _isTesting: true,

    namespace: 'Testing',
    rootDir: rootDir,
    globalScript: null,
    devMode: true,
    enableCache: false,
    buildAppCore: false,
    buildDist: true,
    flags: {},
    bundles: null,
    outputTargets: null,
    buildEs5: false,
    hashFileNames: false,
    logger: new TestingLogger(),
    maxConcurrentWorkers: 0,
    minifyCss: false,
    minifyJs: false,
    sys,
    testing: null,
    validateTypes: false,
    extras: {},
    nodeResolve: {
      customResolveOptions: {},
    },
  };

  return config;
}

export function mockCompilerCtx(config?: Config) {
  if (!config) {
    config = mockConfig();
  }
  const compilerCtx: CompilerCtx = {
    version: 1,
    activeBuildId: 0,
    activeDirsAdded: [],
    activeDirsDeleted: [],
    activeFilesAdded: [],
    activeFilesDeleted: [],
    activeFilesUpdated: [],
    fs: null,
    cachedGlobalStyles: new Map(),
    collections: [],
    compilerOptions: null,
    cache: null,
    cachedStyleMeta: new Map(),
    events: null,
    fsWatcher: null,
    hasSuccessfulBuild: false,
    isActivelyBuilding: false,
    lastComponentStyleInput: new Map(),
    lastBuildResults: null,
    lastBuildStyles: null,
    moduleMap: new Map(),
    nodeMap: new WeakMap(),
    resolvedCollections: new Set(),
    rollupCacheHydrate: null,
    rollupCacheLazy: null,
    rollupCacheNative: null,
    rollupCache: new Map(),
    rootTsFiles: [],
    styleModeNames: new Set(),
    tsService: null,
    changedModules: new Set(),
    changedFiles: new Set(),
    reset: () => {
      /**/
    },
    worker: createWorkerContext(config.sys),
  };

  Object.defineProperty(compilerCtx, 'fs', {
    get() {
      if (this._fs == null) {
        this._fs = createInMemoryFs(config.sys);
      }
      return this._fs;
    },
  });

  Object.defineProperty(compilerCtx, 'cache', {
    get() {
      if (this._cache == null) {
        this._cache = mockCache(config, compilerCtx);
      }
      return this._cache;
    },
  });

  return compilerCtx;
}

export function mockBuildCtx(config?: Config, compilerCtx?: CompilerCtx) {
  if (!config) {
    config = mockConfig();
  }
  if (!compilerCtx) {
    compilerCtx = mockCompilerCtx(config);
  }
  const buildCtx = new BuildContext(config, compilerCtx);

  return buildCtx as BuildCtx;
}

export function mockCache(config?: Config, compilerCtx?: CompilerCtx) {
  if (!config) {
    config = mockConfig();
  }
  if (!compilerCtx) {
    compilerCtx = mockCompilerCtx(config);
  }
  config.enableCache = true;
  const cache = new CompilerCache(config, compilerCtx.fs);
  cache.initCacheDir();
  return cache as Cache;
}

export function mockLogger() {
  return new TestingLogger();
}

export interface TestingSystem extends CompilerSystem {
  diskReads: number;
  diskWrites: number;
}

export function mockStencilSystem(): TestingSystem {
  return createTestingSystem();
}

export function mockDocument(html: string = null) {
  const win = new MockWindow(html);
  return win.document as Document;
}

export function mockWindow(html: string = null) {
  const win = new MockWindow(html);
  return (win as any) as Window;
}
