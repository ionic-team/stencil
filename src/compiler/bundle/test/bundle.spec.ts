import { Bundle, Diagnostic, ManifestBundle, ModuleFile } from '../../../util/interfaces';
import { ENCAPSULATION } from '../../../util/constants';
import { bundleRequiresScopedStyles, getBundlesFromManifest, getBundleModes, getBundleEncapsulations, sortBundles } from '../bundle';


describe('bundle', () => {

  describe('bundleRequiresScopedStyles', () => {

    it('scoped if using shadow', () => {
      const requiresScopedCss = bundleRequiresScopedStyles([
        ENCAPSULATION.ShadowDom
      ]);
      expect(requiresScopedCss).toBe(true);
    });

    it('scoped if using scoped', () => {
      const requiresScopedCss = bundleRequiresScopedStyles([
        ENCAPSULATION.ScopedCss
      ]);
      expect(requiresScopedCss).toBe(true);
    });

    it('no scoped if only using no encapsulation', () => {
      const requiresScopedCss = bundleRequiresScopedStyles([
        ENCAPSULATION.NoEncapsulation, ENCAPSULATION.NoEncapsulation
      ]);
      expect(requiresScopedCss).toBe(false);
    });

    it('no scoped if empty', () => {
      const requiresScopedCss = bundleRequiresScopedStyles([]);
      expect(requiresScopedCss).toBe(false);
    });

  });

  describe('getBundleEncapsulations', () => {

    it('should add scoped when using shadow', () => {
      const bundle: Bundle = {
        moduleFiles: [
          { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom } },
        ]
      };
      const modes = getBundleEncapsulations(bundle);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe(ENCAPSULATION.ShadowDom);
      expect(modes[1]).toBe(ENCAPSULATION.ScopedCss);
    });

    it('get all encapsulations', () => {
      const bundle: Bundle = {
        moduleFiles: [
          { cmpMeta: { encapsulation: ENCAPSULATION.NoEncapsulation } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ScopedCss } },
          { cmpMeta: { encapsulation: ENCAPSULATION.ShadowDom } },
        ]
      };
      const modes = getBundleEncapsulations(bundle);
      expect(modes.length).toBe(3);
      expect(modes[0]).toBe(ENCAPSULATION.NoEncapsulation);
      expect(modes[1]).toBe(ENCAPSULATION.ShadowDom);
      expect(modes[2]).toBe(ENCAPSULATION.ScopedCss);
    });

    it('get no encapsulation', () => {
      const bundle: Bundle = {
        moduleFiles: [
          { cmpMeta: { } },
        ]
      };
      const modes = getBundleEncapsulations(bundle);
      expect(modes.length).toBe(1);
      expect(modes[0]).toBe(ENCAPSULATION.NoEncapsulation);
    });

  });

  describe('getBundleModes', () => {

    it('get specific modes and not default mode when theres a mix', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { stylesMeta: { $: {} } } },
        { cmpMeta: { stylesMeta: { $: {} } } },
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } } },
        { cmpMeta: { stylesMeta: { modeB: {} } } },
        { cmpMeta: { stylesMeta: { modeA: {} } } },
      ];
      const modes = getBundleModes(moduleFiles);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe('modeA');
      expect(modes[1]).toBe('modeB');
    });

    it('get modes only', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } } },
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } } },
      ];
      const modes = getBundleModes(moduleFiles);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe('modeA');
      expect(modes[1]).toBe('modeB');
    });

    it('get default only', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { stylesMeta: { $: {} } } },
      ];
      const modes = getBundleModes(moduleFiles);
      expect(modes.length).toBe(1);
      expect(modes[0]).toBe('$');
    });

    it('get default if no modes found', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: {} },
      ];
      const modes = getBundleModes(moduleFiles);
      expect(modes.length).toBe(1);
      expect(modes[0]).toBe('$');
    });

    it('get modes without dups', () => {
      const moduleFiles: ModuleFile[] = [
        { cmpMeta: { stylesMeta: { modeB: {} } } },
        { cmpMeta: { stylesMeta: { modeA: {} } } },
        { cmpMeta: { stylesMeta: { modeA: {}, modeB: {} } } }
      ];
      const modes = getBundleModes(moduleFiles);
      expect(modes.length).toBe(2);
      expect(modes[0]).toBe('modeA');
      expect(modes[1]).toBe('modeB');
    });

  });

  describe('getBundlesFromManifest', () => {

    it('should error when component isnt found in bundle', () => {
      const manifestBundles: ManifestBundle[] = [
        { components: ['cmp-b', 'cmp-a', 'cmp-z'] },
      ];
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: {} } },
        { cmpMeta: { tagNameMeta: 'cmp-b', stylesMeta: { ios: {}, wp: {} } } },
      ];
      const diagnostics: Diagnostic[] = [];

      const bundles = getBundlesFromManifest(allModuleFiles, manifestBundles, diagnostics);

      expect(bundles.length).toBe(1);
      expect(bundles[0].moduleFiles.length).toBe(2);
      expect(diagnostics.length).toBe(1);
    });

    it('no bundle with no components', () => {
      const manifestBundles: ManifestBundle[] = [
        { components: ['cmp-d', 'cmp-e'] },
        { components: ['cmp-b', 'cmp-a'] },
        { components: [] },
      ];
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-d', stylesMeta: { md: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: {} } },
        { cmpMeta: { tagNameMeta: 'cmp-b', stylesMeta: { ios: {}, wp: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-e', stylesMeta: { ios: {} } } },
      ];
      const diagnostics: Diagnostic[] = [];

      const bundles = getBundlesFromManifest(allModuleFiles, manifestBundles, diagnostics);

      expect(bundles.length).toBe(2);
      expect(diagnostics.length).toBe(0);
    });

    it('load bundles and sort alpha', () => {
      const manifestBundles: ManifestBundle[] = [
        { components: ['cmp-e', 'cmp-d'] },
        { components: ['cmp-b', 'cmp-a'] },
        { components: ['cmp-c'] },
      ];
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-d', stylesMeta: { md: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: {} } },
        { cmpMeta: { tagNameMeta: 'cmp-b', stylesMeta: { ios: {}, wp: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-e', stylesMeta: { ios: {} } } },
        { cmpMeta: { tagNameMeta: 'cmp-c' } },
        {}
      ];
      const diagnostics: Diagnostic[] = [];

      let bundles = getBundlesFromManifest(allModuleFiles, manifestBundles, diagnostics);
      bundles = sortBundles(bundles);

      expect(bundles[0].moduleFiles[0].cmpMeta.tagNameMeta).toBe('cmp-a');
      expect(bundles[0].moduleFiles[1].cmpMeta.tagNameMeta).toBe('cmp-b');
      expect(bundles[1].moduleFiles[0].cmpMeta.tagNameMeta).toBe('cmp-c');
      expect(bundles[2].moduleFiles[0].cmpMeta.tagNameMeta).toBe('cmp-d');
      expect(bundles[2].moduleFiles[1].cmpMeta.tagNameMeta).toBe('cmp-e');
      expect(bundles.length).toBe(3);
      expect(diagnostics.length).toBe(0);
    });

  });

});
