import { Bundle, Diagnostic, ModuleFile } from '../../../util/interfaces';
import { getManifestBundles } from '../bundle';


describe('bundle', () => {

  describe('getManifestBundles', () => {

    it('should error when component isnt found in bundle', () => {
      const bundles: Bundle[] = [
        { components: ['cmp-b', 'cmp-a', 'cmp-z'] },
      ];
      const allModuleFiles: ModuleFile[] =  [
        { cmpMeta: { tagNameMeta: 'cmp-a', stylesMeta: {} } },
        { cmpMeta: { tagNameMeta: 'cmp-b', stylesMeta: { ios: {}, wp: {} } } },
      ];
      const diagnostics: Diagnostic[] = [];

      const manifestBundles = getManifestBundles(allModuleFiles, bundles, diagnostics);

      expect(manifestBundles.length).toBe(1);
      expect(manifestBundles[0].moduleFiles.length).toBe(2);
      expect(diagnostics.length).toBe(1);
    });

    it('not bundle with no components', () => {
      const bundles: Bundle[] = [
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

      const manifestBundles = getManifestBundles(allModuleFiles, bundles, diagnostics);

      expect(manifestBundles.length).toBe(2);
      expect(diagnostics.length).toBe(0);
    });

    it('load bundles and sort alpha', () => {
      const bundles: Bundle[] = [
        { components: ['cmp-d', 'cmp-e'] },
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

      const manifestBundles = getManifestBundles(allModuleFiles, bundles, diagnostics);

      expect(manifestBundles[0].components[0]).toBe('cmp-a');
      expect(manifestBundles[0].components[1]).toBe('cmp-b');
      expect(manifestBundles[1].components[0]).toBe('cmp-c');
      expect(manifestBundles[2].components[0]).toBe('cmp-d');
      expect(manifestBundles[2].components[1]).toBe('cmp-e');
      expect(manifestBundles.length).toBe(3);
      expect(diagnostics.length).toBe(0);
    });

  });

});
