import * as d from '../declarations';
import { BuildContext, Cache, validateConfig } from '../compiler';
import { InMemoryFileSystem } from '@utils';
import { MockWindow } from '@mock-doc';
import { TestingConfig } from './testing-config';
import { TestingFs } from './testing-fs';
import { TestingLogger } from './testing-logger';
import { TestingSystem } from './testing-sys';
import path from 'path';


export function mockConfig(): d.Config {
  const config = new TestingConfig();
  return validateConfig(config);
}


export function mockCompilerCtx() {
  const compilerCtx: d.CompilerCtx = {
    activeBuildId: 0,
    activeDirsAdded: [],
    activeDirsDeleted: [],
    activeFilesAdded: [],
    activeFilesDeleted: [],
    activeFilesUpdated: [],
    fs: null,
    collections: [],
    compilerOptions: null,
    cache: null,
    cachedStyleMeta: new Map(),
    events: null,
    fsWatcher: null,
    hasLoggedServerUrl: false,
    hasSuccessfulBuild: false,
    isActivelyBuilding: false,
    lastComponentStyleInput: new Map(),
    lastBuildHadError: false,
    lastBuildResults: null,
    lastBuildStyles: null,
    lazyModuleRollupCache: new Map(),
    localPrerenderServer: null,
    moduleMap: new Map(),
    nodeMap: new WeakMap(),
    resolvedCollections: new Set(),
    rootTsFiles: [],
    tsService: null,
    reset: () => {/**/}
  };

  Object.defineProperty(compilerCtx, 'fs', {
    get() {
      if (this._fs == null) {
        this._fs = new InMemoryFileSystem(mockFs(), path);
      }
      return this._fs;
    }
  });

  Object.defineProperty(compilerCtx, 'cache', {
    get() {
      if (this._cache == null) {
        this._cache = mockCache();
      }
      return this._fs;
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
  const fs = new InMemoryFileSystem(mockFs(), path);
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
