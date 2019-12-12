import * as d from '../../../../declarations';
import { createInMemoryFs } from '../../../sys/in-memory-fs';
import { createSystem } from '../../../sys/stencil-sys';
import { ensureUrlExtension } from '../typescript-resolve-module';
import { getStencilInternalDtsUrl } from '../../fetch/fetch-utils';
import { tsRemoteResolveModule } from '../typescript-resolve-module';
import ts from 'typescript';


describe('typescript resolve module', () => {
  const config: d.Config = { rootDir: '/' };
  let inMemoryFs: d.InMemoryFileSystem;
  let sys: d.CompilerSystem;
  const compilerExe = 'https://unpkg.com/@stencil/core/compiler/stencil.js';

  beforeEach(() => {
    sys = createSystem();
    inMemoryFs = createInMemoryFs(sys);
  });

  describe('ensureUrlExtension', () => {

    it('add d.ts ext as the containing url', () => {
      const url = 'http://stencil.com/filename';
      const containingUrl = 'http://stencil.com/index.d.ts';
      const r = ensureUrlExtension(url, containingUrl);
      expect(r).toBe('http://stencil.com/filename.d.ts');
    });

    it('add js ext as the containing url', () => {
      const url = 'http://stencil.com/filename';
      const containingUrl = 'http://stencil.com/index.js';
      const r = ensureUrlExtension(url, containingUrl);
      expect(r).toBe('http://stencil.com/filename.js');
    });

    it('do nothing when url already had an ext', () => {
      const url = 'http://stencil.com/filename.js';
      const containingUrl = 'http://stencil.com/index.js';
      const r = ensureUrlExtension(url, containingUrl);
      expect(r).toBe(url);
    });

  });

  it('resolve ./stencil-private.d.ts to full dts url when imported by internal dts url', () => {
    const moduleName = './stencil-private';
    const containingFile = getStencilInternalDtsUrl(compilerExe);
    const r = tsRemoteResolveModule(config, inMemoryFs, compilerExe, moduleName, containingFile);
    expect(r).toEqual({
      resolvedModule: {
        extension: ts.Extension.Dts,
        resolvedFileName: 'https://unpkg.com/@stencil/core/internal/stencil-private.d.ts',
        packageId: {
          name: moduleName,
          subModuleName: '',
          version: '__VERSION:STENCIL__'
        }
      }
    });
  });

  it('resolve @stencil/core/internal to internal dts url', () => {
    const moduleName = '@stencil/core';
    const containingFile = './cmp.tsx';
    const r = tsRemoteResolveModule(config, inMemoryFs, compilerExe, moduleName, containingFile);
    expect(r).toEqual({
      resolvedModule: {
        extension: ts.Extension.Dts,
        resolvedFileName: 'https://unpkg.com/@stencil/core/internal/index.d.ts',
        packageId: {
          name: moduleName,
          subModuleName: '',
          version: '__VERSION:STENCIL__'
        }
      }
    });
  });

  it('resolve @stencil/core to internal dts url', () => {
    const moduleName = '@stencil/core';
    const containingFile = './cmp.tsx';
    const r = tsRemoteResolveModule(config, inMemoryFs, compilerExe, moduleName, containingFile);
    expect(r).toEqual({
      resolvedModule: {
        extension: ts.Extension.Dts,
        resolvedFileName: 'https://unpkg.com/@stencil/core/internal/index.d.ts',
        packageId: {
          name: moduleName,
          subModuleName: '',
          version: '__VERSION:STENCIL__'
        }
      }
    });
  });

  it('do nothing for local path', () => {
    const moduleName = './style.css';
    const containingFile = './cmp.tsx';
    const r = tsRemoteResolveModule(config, inMemoryFs, compilerExe, moduleName, containingFile);
    expect(r).toEqual(null);
  });

});
