import { BuildConfig, BuildContext, Bundle, ComponentMeta, ManifestBundle, ModuleFile } from '../../../util/interfaces';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../../util/constants';
import { bundleRequiresScopedStyles } from '../bundle-styles';
import { getBundleIdDev, getBundleIdHashed, setBundleModeIds } from '../generate-bundles';
import { mockStencilSystem } from '../../../testing/mocks';


describe('generate-bundles', () => {

  describe('setBundleModeIds', () => {

    it('should set default style mode with null mode name', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { bundleIds: {} } }
      ];
      setBundleModeIds(moduleFiles, null, 'bundle-id');
      expect(moduleFiles[0].cmpMeta.bundleIds[DEFAULT_STYLE_MODE].esm).toBe('bundle-id');
    });

    it('should set mode with es2015 mode name', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { bundleIds: {} } }
      ];
      setBundleModeIds(moduleFiles, 'ios', 'bundle-id');
      expect(moduleFiles[0].cmpMeta.bundleIds.ios.esm).toBe('bundle-id');
    });

    it('should set mode with es5 mode name', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { bundleIds: {} } }
      ];
      setBundleModeIds(moduleFiles, 'ios', 'bundle-id', 'es5');
      expect(moduleFiles[0].cmpMeta.bundleIds.ios.es5).toBe('bundle-id');
    });

  });

  describe('getBundleId', () => {

    it('get bundle id from hashed content', () => {
      const config: BuildConfig = { hashFileNames: true, hashedFileNameLength: 4 };
      config.sys = mockStencilSystem();

      const id = getBundleIdHashed(config, 'abcdefg');
      expect(id).toBe('l7xh');
    });

    it('get bundle id from components and mode', () => {
      const id = getBundleIdDev(['cmp-a', 'cmp-b'], 'ios', false);
      expect(id).toBe('cmp-a.ios');
    });

    it('get bundle id from components and default mode', () => {
      const id = getBundleIdDev(['cmp-a', 'cmp-b'], 'ios', false);
      expect(id).toBe('cmp-a.ios');
    });

    it('get bundle id from components, mode, scoped css', () => {
      const config: BuildConfig = {};
      const id = getBundleIdDev(['cmp-a', 'cmp-b'], 'md', true);
      expect(id).toBe('cmp-a.md.sc');
    });

    it('get bundle id from components, mode, scoped css, es5', () => {
      const config: BuildConfig = {};
      const id = getBundleIdDev(['cmp-a', 'cmp-b'], 'md', true, 'es5');
      expect(id).toBe('cmp-a.md.sc.es5');
    });

    it('get bundle id from components and null mode', () => {
      const config: BuildConfig = {};
      const id = getBundleIdDev(['cmp-a', 'cmp-b'], null, false);
      expect(id).toBe('cmp-a');
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
