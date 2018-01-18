import { DependentCollection, Manifest, ManifestBundle } from '../../../util/interfaces';
import { filterDependentComponents } from '../load-dependent-manifests';


describe('manifest', () => {

  describe('filterDependentComponents', () => {

    it('should remove components not found in user bundles if includeBundledOnly is true', () => {
      const bundles: ManifestBundle[] = [
        { components: ['cmp-a'] },
        { components: ['cmp-b', 'cmp-e'] }
      ];
      const dependentCollection: DependentCollection = {
        name: '@awesome/collection',
        includeBundledOnly: true
      };
      const dependentManifest: Manifest = {
        modulesFiles: [
          { cmpMeta: { tagNameMeta: 'cmp-a' } },
          { cmpMeta: { tagNameMeta: 'cmp-b' } },
          { cmpMeta: { tagNameMeta: 'cmp-c' } },
          { cmpMeta: { tagNameMeta: 'cmp-d' } },
          { cmpMeta: { tagNameMeta: 'cmp-e' } }
        ]
      };

      filterDependentComponents(bundles, dependentCollection, dependentManifest);

      expect(dependentManifest.modulesFiles.length).toBe(3);
      expect(dependentManifest.modulesFiles[0].cmpMeta.tagNameMeta).toBe('cmp-a');
      expect(dependentManifest.modulesFiles[1].cmpMeta.tagNameMeta).toBe('cmp-b');
      expect(dependentManifest.modulesFiles[2].cmpMeta.tagNameMeta).toBe('cmp-e');
    });

    it('should keep all components if includeBundledOnly is falsy', () => {
      const bundles: ManifestBundle[] = [];
      const dependentCollection: DependentCollection = { name: '@awesome/collection' };
      const dependentManifest: Manifest = {
        modulesFiles: [
          { cmpMeta: { tagNameMeta: 'cmp-a' } },
          { cmpMeta: { tagNameMeta: 'cmp-b' } },
          { cmpMeta: { tagNameMeta: 'cmp-c' } }
        ]
      };

      filterDependentComponents(bundles, dependentCollection, dependentManifest);

      expect(dependentManifest.modulesFiles.length).toBe(3);
    });

  });

});
