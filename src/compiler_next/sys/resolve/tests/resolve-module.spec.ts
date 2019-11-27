import { isLocalModule, isRemoteUrlCompiler, isStencilCoreImport, setPackageVersionByContent } from '../resolve-utils';


describe('resolve modules', () => {
  let compilerExe: string;
  const pkgVersions = new Map<string, string>();

  beforeEach(() => {
    compilerExe = 'http://localhost:3333/@stencil/core/compiler/stencil.js';
    pkgVersions.clear();
  });

  it('isStencilCoreImport', () => {
    expect(isStencilCoreImport('@stencil/core')).toBe(true);
    expect(isStencilCoreImport('@stencil/core/internal')).toBe(true);
    expect(isStencilCoreImport('@stencil/core/internal/client')).toBe(true);
    expect(isStencilCoreImport('@stencil/core/internal/client/index.mjs')).toBe(true);
    expect(isStencilCoreImport('lodash')).toBe(false);
    expect(isStencilCoreImport('@ionic/core')).toBe(false);
  });

  it('isLocalModule', () => {
    expect(isLocalModule('./local.tsx')).toBe(true);
    expect(isLocalModule('/local.tsx')).toBe(true);
    expect(isLocalModule('lodash')).toBe(false);
    expect(isLocalModule('@ionic/core')).toBe(false);
  });

  it('isRemoteUrlCompiler', () => {
    expect(isRemoteUrlCompiler('http://localhost/comiler/stencil.js')).toBe(true);
    expect(isRemoteUrlCompiler('https://localhost/comiler/stencil.js')).toBe(true);
    expect(isRemoteUrlCompiler('/User/app/node_modules/stencil.js')).toBe(false);
  });

  describe('setPackageVersionByContent', () => {

    it('set scoped package', () => {
      const pkgContent = JSON.stringify({
        name: '@ionic/core',
        version: '1.2.3'
      });
      setPackageVersionByContent(pkgVersions, pkgContent);
      expect(pkgVersions.get('/@ionic/core/')).toBe('1.2.3');
    });

    it('set package', () => {
      const pkgContent = JSON.stringify({
        name: 'lodash',
        version: '1.2.3'
      });
      setPackageVersionByContent(pkgVersions, pkgContent);
      expect(pkgVersions.get('/lodash/')).toBe('1.2.3');
    });

  });

});
