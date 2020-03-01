import * as d from '@stencil/core/internal';
import { BuildContext, Cache } from '../compiler';
import { InMemoryFs } from '@utils';
import { MockWindow } from '@stencil/core/mock-doc';
import { TestingFs } from './testing-fs';
import { TestingLogger } from './testing-logger';
import { TestingSystem } from './testing-sys_legacy';
import path from 'path';


export function mockConfig() {
  const sys = new TestingSystem();
  const config: d.Config = {
    _isTesting: true,

    namespace: 'Testing',
    rootDir: path.resolve('/'),
    cwd: path.resolve('/'),
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
    maxConcurrentWorkers: 1,
    minifyCss: false,
    minifyJs: false,
    sys,
    testing: null,
    validateTypes: false,
    extras: {},
    nodeResolve: {
      customResolveOptions: {},
    },
    sys_next: {
      getCompilerExecutingPath() {
        return sys.getCompilerExecutingPath();
      }
    } as any
  };

  return config;
}


export function mockCompilerCtx() {
  const compilerCtx: d.CompilerCtx = {
    version: 1,
    activeBuildId: 0,
    activeDirsAdded: [],
    activeDirsDeleted: [],
    activeFilesAdded: [],
    activeFilesDeleted: [],
    activeFilesUpdated: [],
    fs: null,
    cachedGlobalStyle: null,
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
    reset: () => {/**/}
  };

  Object.defineProperty(compilerCtx, 'fs', {
    get() {
      if (this._fs == null) {
        this._fs = new InMemoryFs(mockFs(), path);
      }
      return this._fs;
    }
  });

  Object.defineProperty(compilerCtx, 'cache', {
    get() {
      if (this._cache == null) {
        this._cache = mockCache();
      }
      return this._cache;
    }
  });

  return compilerCtx;
}


export function mockBuildCtx(config?: d.Config, compilerCtx?: d.CompilerCtx) {
  if (!config) {
    config = mockConfig();
  }
  if (!compilerCtx) {
    compilerCtx = mockCompilerCtx();
  }
  const buildCtx = new BuildContext(config, compilerCtx);

  return buildCtx as d.BuildCtx;
}


export function mockFs() {
  return new TestingFs();
}


export function mockCache() {
  const fs = new InMemoryFs(mockFs(), path);
  const config = mockConfig();
  config.enableCache = true;

  const cache = new Cache(config, fs);
  cache.initCacheDir();
  return cache as d.Cache;
}


export function mockLogger() {
  return new TestingLogger();
}


export function mockStencilSystem(): d.StencilSystem {
  return new TestingSystem();
}


export function mockDocument(html: string = null) {
  const win = new MockWindow(html);
  return win.document as Document;
}


export function mockWindow(html: string = null) {
  const win = new MockWindow(html);
  return (win as any) as Window;
}
