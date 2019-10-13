import { getNodeModuleFetchUrl, getStencilModulePath, getStencilModuleUrl, isRemoteUrlCompiler, setPkgVersion, skipFilePathFetch } from '../resolve/resolve-utils';


describe('resolve modules', () => {
  let compilerExecutingPath: string;
  const pkgVersions = new Map<string, string>();

  beforeEach(() => {
    compilerExecutingPath = 'http://localhost:3333/@stencil/core/compiler/stencil.js';
    pkgVersions.clear();
  });

  it('getStencilModulePath', () => {
    const p = 'internal/client/index.mjs';
    const m = getStencilModulePath(p);
    expect(m).toBe('/node_modules/@stencil/core/internal/client/index.mjs');
  });

  it('isRemoteUrlCompiler', () => {
    expect(isRemoteUrlCompiler('http://localhost/comiler/stencil.js')).toBe(true);
    expect(isRemoteUrlCompiler('https://localhost/comiler/stencil.js')).toBe(true);
    expect(isRemoteUrlCompiler('/User/app/node_modules/stencil.js')).toBe(false);
  });

  describe('getStencilModulePath', () => {

    it('cdn w/ version', () => {
      compilerExecutingPath = 'https://cdn.jsdelivr.net/npm/@stencil/core@1.2.3/compiler/stencil.js';
      const p = '/node_modules/@stencil/core/package.json';
      const m = getStencilModuleUrl(compilerExecutingPath, p);
      expect(m).toBe('https://cdn.jsdelivr.net/npm/@stencil/core@1.2.3/package.json');
    });

    it('cdn w/out version', () => {
      compilerExecutingPath = 'https://cdn.jsdelivr.net/npm/@stencil/core/compiler/stencil.js';
      const p = '/node_modules/@stencil/core/internal/client/index.mjs';
      const m = getStencilModuleUrl(compilerExecutingPath, p);
      expect(m).toBe('https://cdn.jsdelivr.net/npm/@stencil/core/internal/client/index.mjs');
    });

    it('local w/out version', () => {
      const p = '/node_modules/@stencil/core/package.json';
      const m = getStencilModuleUrl(compilerExecutingPath, p);
      expect(m).toBe('http://localhost:3333/@stencil/core/package.json');
    });

  });

  describe('getNodeModuleFetchUrl', () => {

    it('cdn @stencil/core', () => {
      compilerExecutingPath = 'https://cdn.jsdelivr.net/npm/@stencil/core@1.2.3/compiler/stencil.js';
      const filePath = '/node_modules/@stencil/core/internal/hydrate/index.mjs';
      const url = getNodeModuleFetchUrl(compilerExecutingPath, pkgVersions, filePath);
      expect(url).toBe('https://cdn.jsdelivr.net/npm/@stencil/core@1.2.3/internal/hydrate/index.mjs');
    });

    it('local @stencil/core', () => {
      const filePath = '/node_modules/@stencil/core/package.json';
      const url = getNodeModuleFetchUrl(compilerExecutingPath, pkgVersions, filePath);
      expect(url).toBe('http://localhost:3333/@stencil/core/package.json');
    });

    it('w/ version number', () => {
      pkgVersions.set('/lodash/', '1.2.3');
      const filePath = '/node_modules/lodash/package.json';
      const url = getNodeModuleFetchUrl(compilerExecutingPath, pkgVersions, filePath);
      expect(url).toBe('https://cdn.jsdelivr.net/npm/lodash@1.2.3/package.json');
    });

    it('w/out version number', () => {
      const filePath = '/node_modules/lodash/package.json';
      const url = getNodeModuleFetchUrl(compilerExecutingPath, pkgVersions, filePath);
      expect(url).toBe('https://cdn.jsdelivr.net/npm/lodash/package.json');
    });

    it('w/ scoped package', () => {
      const filePath = '/node_modules/@ionic/core/package.json';
      const url = getNodeModuleFetchUrl(compilerExecutingPath, pkgVersions, filePath);
      expect(url).toBe('https://cdn.jsdelivr.net/npm/@ionic/core/package.json');
    });

    it('version w/ scoped package', () => {
      pkgVersions.set('/@ionic/core/', '1.2.3');
      const filePath = '/node_modules/@ionic/core/package.json';
      const url = getNodeModuleFetchUrl(compilerExecutingPath, pkgVersions, filePath);
      expect(url).toBe('https://cdn.jsdelivr.net/npm/@ionic/core@1.2.3/package.json');
    });

  });

  describe('setPkgVersion', () => {

    it('set scoped package', () => {
      const pkgContent = JSON.stringify({
        name: '@ionic/core',
        version: '1.2.3'
      });
      setPkgVersion(pkgContent, pkgVersions);
      expect(pkgVersions.get('/@ionic/core/')).toBe('1.2.3');
    });

    it('set package', () => {
      const pkgContent = JSON.stringify({
        name: 'lodash',
        version: '1.2.3'
      });
      setPkgVersion(pkgContent, pkgVersions);
      expect(pkgVersions.get('/lodash/')).toBe('1.2.3');
    });

  });

  describe('skipFilePathFetch', () => {

    it('skip for known bogus node_module paths', () => {
      expect(skipFilePathFetch('/node_modules/index.mjs')).toBe(true);
      expect(skipFilePathFetch('/node_modules/lodash.js')).toBe(true);
      expect(skipFilePathFetch('/node_modules/lodash.md')).toBe(true);
      expect(skipFilePathFetch('/node_modules/lodash.json')).toBe(true);
      expect(skipFilePathFetch('/asdf/gadsf/aessd/gaes/node_modules/lodash.js')).toBe(true);
      expect(skipFilePathFetch('/asdf/node_modules/whatever/lodash.js')).toBe(false);
    });

    it('skip for ts and tsx', () => {
      expect(skipFilePathFetch('whatever.ts')).toBe(true);
      expect(skipFilePathFetch('whatever.tsx')).toBe(true);
    });

  });

});
