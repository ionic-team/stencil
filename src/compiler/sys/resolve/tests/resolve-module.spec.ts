import { isExternalUrl, isLocalModule, isStencilCoreImport, isNodeModulePath, setPackageVersionByContent } from '../resolve-utils';

describe('resolve modules', () => {
  const pkgVersions = new Map<string, string>();

  beforeEach(() => {
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

  it('isExternalUrl', () => {
    expect(isExternalUrl('http://localhost/comiler/stencil.js')).toBe(true);
    expect(isExternalUrl('https://localhost/comiler/stencil.js')).toBe(true);
    expect(isExternalUrl('/User/app/node_modules/stencil.js')).toBe(false);
    expect(isExternalUrl('C:\\path\\to\\local\\index.js')).toBe(false);
  });

  it('isNodeModulePath', () => {
    expect(isNodeModulePath('/path/to/local/module/index.js')).toBe(false);
    expect(isNodeModulePath('/path/to/node_modules/lodash/index.js')).toBe(true);
    expect(isNodeModulePath('/node_modules/lodash/index.js')).toBe(true);
    expect(isNodeModulePath('C:\\path\\to\\node_modules\\lodash\\index.js')).toBe(true);
    expect(isNodeModulePath('C:\\path\\to\\local\\index.js')).toBe(false);
  });

  describe('setPackageVersionByContent', () => {
    it('set scoped package', () => {
      const pkgContent = JSON.stringify({
        name: '@ionic/core',
        version: '1.2.3',
      });
      setPackageVersionByContent(pkgVersions, pkgContent);
      expect(pkgVersions.get('@ionic/core')).toBe('1.2.3');
    });

    it('set package', () => {
      const pkgContent = JSON.stringify({
        name: 'lodash',
        version: '1.2.3',
      });
      setPackageVersionByContent(pkgVersions, pkgContent);
      expect(pkgVersions.get('lodash')).toBe('1.2.3');
    });
  });
});
