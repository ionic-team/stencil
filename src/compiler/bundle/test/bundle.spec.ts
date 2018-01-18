import { Bundle, Diagnostic, ManifestBundle, ModuleFile } from '../../../util/interfaces';
import { ENCAPSULATION } from '../../../util/constants';
import { getBundlesFromManifest } from '../bundle';
import { sortBundles } from '../bundle-utils';


describe('bundle', () => {

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
