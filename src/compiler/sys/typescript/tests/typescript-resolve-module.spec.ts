import * as d from '../../../../declarations';
import { createInMemoryFs } from '../../../sys/in-memory-fs';
import { createSystem } from '../../../sys/stencil-sys';
import { ensureExtension } from '../typescript-resolve-module';
import { getStencilInternalDtsPath } from '../../resolve/resolve-utils';
import { patchedTsResolveModule } from '../typescript-resolve-module';
import ts from 'typescript';

describe('typescript resolve module', () => {
  const config: d.Config = { rootDir: '/some/path' };
  let inMemoryFs: d.InMemoryFileSystem;
  let sys: d.CompilerSystem;

  beforeEach(() => {
    config.rootDir = '/some/path';
    sys = createSystem();
    inMemoryFs = createInMemoryFs(sys);
  });

  describe('ensureExtension', () => {
    it('add d.ts ext as the containing url', () => {
      const url = 'http://stencil.com/filename';
      const containingUrl = 'http://stencil.com/index.d.ts';
      const r = ensureExtension(url, containingUrl);
      expect(r).toBe('http://stencil.com/filename.d.ts');
    });

    it('add js ext as the containing url', () => {
      const url = 'http://stencil.com/filename';
      const containingUrl = 'http://stencil.com/index.js';
      const r = ensureExtension(url, containingUrl);
      expect(r).toBe('http://stencil.com/filename.js');
    });

    it('do nothing when url already had an ext', () => {
      const url = 'http://stencil.com/filename.js';
      const containingUrl = 'http://stencil.com/index.js';
      const r = ensureExtension(url, containingUrl);
      expect(r).toBe(url);
    });
  });

  it('resolve ./stencil-private.d.ts to full dts path when imported by internal dts url', () => {
    const moduleName = './stencil-private';
    const containingFile = getStencilInternalDtsPath(config.rootDir);
    expect(containingFile).toBe('/some/path/node_modules/@stencil/core/internal/index.d.ts');

    const r = patchedTsResolveModule(config, inMemoryFs, moduleName, containingFile);
    expect(r).toEqual({
      resolvedModule: {
        extension: ts.Extension.Dts,
        resolvedFileName: '/some/path/node_modules/@stencil/core/internal/stencil-private.d.ts',
        packageId: {
          name: moduleName,
          subModuleName: '',
          version: '__VERSION:STENCIL__',
        },
      },
    });
  });

  it('resolve @stencil/core/internal to internal dts url', () => {
    const moduleName = '@stencil/core/internal';
    const containingFile = './cmp.tsx';
    const r = patchedTsResolveModule(config, inMemoryFs, moduleName, containingFile);
    expect(r).toEqual({
      resolvedModule: {
        extension: ts.Extension.Dts,
        resolvedFileName: '/some/path/node_modules/@stencil/core/internal/index.d.ts',
        packageId: {
          name: moduleName,
          subModuleName: '',
          version: '__VERSION:STENCIL__',
        },
      },
    });
  });

  it('resolve @stencil/core to internal dts url', () => {
    const moduleName = '@stencil/core';
    const containingFile = './cmp.tsx';
    const r = patchedTsResolveModule(config, inMemoryFs, moduleName, containingFile);
    expect(r).toEqual({
      resolvedModule: {
        extension: ts.Extension.Dts,
        resolvedFileName: '/some/path/node_modules/@stencil/core/internal/index.d.ts',
        packageId: {
          name: moduleName,
          subModuleName: '',
          version: '__VERSION:STENCIL__',
        },
      },
    });
  });

  it('local path', () => {
    const moduleName = './module.ts';
    const containingFile = './cmp.tsx';
    const r = patchedTsResolveModule(config, inMemoryFs, moduleName, containingFile);
    expect(r.resolvedModule.resolvedFileName).toEqual('./module.ts');
  });
});
