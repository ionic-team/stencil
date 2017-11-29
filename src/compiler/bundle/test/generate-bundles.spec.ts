import { BuildConfig, BuildContext, Bundle, ComponentMeta, ManifestBundle, ModuleFile } from '../../../util/interfaces';
import {
  bundleRequiresScopedStyles,
  containsDefaultMode,
  containsNonDefaultModes,
  getBundleId,
  getManifestBundleModes,
  setBundleModeIds,
  writeBundleFile
} from '../generate-bundles';
import { getBundleFileName } from '../../app/app-file-naming';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../../util/constants';
import { mockStencilSystem } from '../../../testing/mocks';


describe('generate-bundles', () => {

  describe('containsNonDefaultModes', () => {

    it('should not contain non default', () => {
      expect(containsDefaultMode(['ios'])).toBe(false);
      expect(containsDefaultMode([])).toBe(false);
    });

    it('should contain non default', () => {
      expect(containsNonDefaultModes(['$', 'ios'])).toBe(true);
    });

  });

  describe('containsDefaultMode', () => {

    it('should not contain default', () => {
      expect(containsDefaultMode(['ios', 'md'])).toBe(false);
      expect(containsDefaultMode([])).toBe(false);
    });

    it('should contain default', () => {
      expect(containsDefaultMode(['$', 'ios'])).toBe(true);
    });

  });

  describe('setBundleModeIds', () => {

    it('should set default style mode with null mode name', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { bundleIds: {} } }
      ];
      setBundleModeIds(moduleFiles, null, 'bundle-id', 'es2015');
      expect(moduleFiles[0].cmpMeta.bundleIds[DEFAULT_STYLE_MODE].es2015).toBe('bundle-id');
    });

    it('should set mode with es2015 mode name', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { bundleIds: {} } }
      ];
      setBundleModeIds(moduleFiles, 'ios', 'bundle-id', 'es2015');
      expect(moduleFiles[0].cmpMeta.bundleIds.ios.es2015).toBe('bundle-id');
    });

    it('should set mode with es5 mode name', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { bundleIds: {} } }
      ];
      setBundleModeIds(moduleFiles, 'ios', 'bundle-id', 'es5');
      expect(moduleFiles[0].cmpMeta.bundleIds.ios.es5).toBe('bundle-id');
    });

  });

  describe('getBundleFileName', () => {

    it('get filename from bundle id and scoped', () => {
      const fileName = getBundleFileName('bundle-id', true);
      expect(fileName).toBe('bundle-id.sc.js');
    });

    it('get filename from bundle id only', () => {
      const fileName = getBundleFileName('bundle-id', false);
      expect(fileName).toBe('bundle-id.js');
    });

  });

  describe('getBundleId', () => {

    it('get bundle id from hashed content', () => {
      const config: BuildConfig = { hashFileNames: true, hashedFileNameLength: 4 };
      config.sys = mockStencilSystem();

      const styleId = getBundleId(config, ['cmp-a', 'cmp-b'], 'ios', 'h1{color:blue;}');

      expect(styleId).toBe('ehrd');
    });

    it('get bundle id from components and mode', () => {
      const config: BuildConfig = {};
      const styleId = getBundleId(config, ['cmp-a', 'cmp-b'], 'ios', 'h1{color:blue;}');

      expect(styleId).toBe('cmp-a.ios');
    });

    it('get bundle id from components and default mode', () => {
      const config: BuildConfig = {};
      const styleId = getBundleId(config, ['cmp-a', 'cmp-b'], '$', 'h1{color:blue;}');

      expect(styleId).toBe('cmp-a');
    });

    it('get bundle id from components and null mode', () => {
      const config: BuildConfig = {};
      const styleId = getBundleId(config, ['cmp-a', 'cmp-b'], null, 'h1{color:blue;}');

      expect(styleId).toBe('cmp-a');
    });

  });

  describe('bundleRequiresScopedStyles', () => {

    it('scoped styles required for shadow dom w/ styles', () => {
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-d', encapsulation: ENCAPSULATION.ShadowDom, stylesMeta: {} } },
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: { $: {}, md: {} } } },
        { }
      ];

      const isRequired = bundleRequiresScopedStyles(allModuleFiles);
      expect(isRequired).toBe(true);
    });

    it('scoped styles required for scoped css w/ styles', () => {
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-d', encapsulation: ENCAPSULATION.ScopedCss, stylesMeta: {} } },
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: { $: {}, md: {} } } },
        { }
      ];

      const isRequired = bundleRequiresScopedStyles(allModuleFiles);
      expect(isRequired).toBe(true);
    });

    it('scoped styles not required', () => {
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: { $: {}, md: {} } } },
        { }
      ];

      const isRequired = bundleRequiresScopedStyles(allModuleFiles);
      expect(isRequired).toBe(false);
    });

  });

});
