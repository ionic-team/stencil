import { BuildConfig, BuildContext, Bundle, Diagnostic, ModuleFile } from '../../../util/interfaces';
import {
  bundledComponentContainsChangedFile,
  canSkipBuild,
  createInMemoryBundleInput,
  generateBundleExport,
  generateBundleImport,
  getModuleBundleCacheKey
 } from '../component-modules';
 import { mockStencilSystem } from '../../../testing/mocks';


describe('component-modules', () => {

  describe('createInMemoryBundleInput', () => {

    it('should create in memory bundle input', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { tagNameMeta: 'cmp-a', componentClass: 'CmpA' }, jsFilePath: '/tmp/cmp-a.js' },
        { cmpMeta: { tagNameMeta: 'cmp-b', componentClass: 'CmpB' }, jsFilePath: '/tmp/cmp-b.js' },
        { cmpMeta: { tagNameMeta: 'cmp-c', componentClass: 'CmpC' }, jsFilePath: '/tmp/cmp-c.js' },
      ];
      const input = createInMemoryBundleInput(moduleFiles);
      expect(input.length).toBe(6);
    });

  });

  describe('generateBundleImport', () => {

    it('should create bundle import', () => {
      const cmpClassName = 'MyClassName';
      const asName = 'AsName';
      const importPath = 'c:\\import\\path';
      const bundleImport = generateBundleImport(cmpClassName, asName, importPath);
      expect(bundleImport).toBe(`import { MyClassName as AsName } from "c:/import/path";`);
    });

  });

  describe('generateBundleExport', () => {

    it('should create bundle import', () => {
      const tagName = 'MY-tag';
      const asName = 'AsName';
      const bundleImport = generateBundleExport(tagName, asName);
      expect(bundleImport).toBe(`exports['my-tag'] = AsName;`);
    });

  });

  describe('canSkipBuild', () => {
    const moduleFiles: ModuleFile[] = [];

    it('can skip if change build, has cached output, wasnt non-component change, wasnt component module change', () => {
      const config: BuildConfig = {};
      const ctx: BuildContext = {
        isChangeBuild: true,
        moduleBundleOutputs: { cacheKey: 'jstext' },
        changeHasNonComponentModules: false,
        changeHasComponentModules: false,
      };
      const cacheKey = 'cacheKey';
      const skip = canSkipBuild(config, ctx, moduleFiles, cacheKey);
      expect(skip).toBe(true);
    });

    it('cannot skip has non component module changes', () => {
      const config: BuildConfig = {};
      const ctx: BuildContext = {
        isChangeBuild: true,
        moduleBundleOutputs: { cacheKey: 'jstext' },
        changeHasNonComponentModules: true
      };
      const cacheKey = 'cacheKey';
      const skip = canSkipBuild(config, ctx, moduleFiles, cacheKey);
      expect(skip).toBe(false);
    });

    it('cannot skip if it isnt anything cached', () => {
      const config: BuildConfig = {};
      const ctx: BuildContext = {
        isChangeBuild: true,
        moduleBundleOutputs: {}
      };
      const cacheKey = 'cacheKey';
      const skip = canSkipBuild(config, ctx, moduleFiles, cacheKey);
      expect(skip).toBe(false);
    });

    it('cannot skip if it isnt a change build', () => {
      const config: BuildConfig = {};
      const ctx: BuildContext = { isChangeBuild: false };
      const cacheKey = 'cacheKey';
      const skip = canSkipBuild(config, ctx, moduleFiles, cacheKey);
      expect(skip).toBe(false);
    });

  });

  describe('bundledComponentContainsChangedFile', () => {
    const config: BuildConfig = {
      sys: mockStencilSystem()
    };
    const moduleFiles: ModuleFile[] = [
      { jsFilePath: '/tmp/build/cmp-a.js' },
      { jsFilePath: '/tmp/build/cmp-b.js' },
      { jsFilePath: '/tmp/build/cmp-c.js' }
    ];

    it('should not contain changed files', () => {
      const changedFiles = [
        '/User/app/build/cmp-x.ts',
        '/User/app/build/cmp-y.tsx'
      ];
      const hasChanged = bundledComponentContainsChangedFile(config, moduleFiles, changedFiles);
      expect(hasChanged).toBe(false);
    });

    it('should contain changed files', () => {
      const changedFiles = [
        '/User/app/build/cmp-a.ts',
        '/User/app/build/cmp-b.tsx'
      ];
      const hasChanged = bundledComponentContainsChangedFile(config, moduleFiles, changedFiles);
      expect(hasChanged).toBe(true);
    });

  });

  describe('getModuleBundleCacheKey', () => {

    it('should create the cache key', () => {
      const cacheKey = getModuleBundleCacheKey(['CMP-Z', 'cmp-A']);
      expect(cacheKey).toBe('cmp-a.cmp-z');
    });

  });

});
