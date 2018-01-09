import { BuildConfig, BuildContext, Bundle, Diagnostic, ModuleFile } from '../../../util/interfaces';
import {
  bundledComponentContainsChangedFile,
  canSkipBuild
 } from '../bundle-modules';
 import { mockStencilSystem } from '../../../testing/mocks';


describe('bundle-modules', () => {

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

});
