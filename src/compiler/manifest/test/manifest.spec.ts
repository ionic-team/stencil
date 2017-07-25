import { Bundle, DependentCollection, Manifest } from '../../interfaces';
import { filterDependentComponents } from '../load-dependent-manifests';
import { validateDependentCollection } from '../../build/validation';


describe('manifest', () => {

  describe('filterDependentComponents', () => {

    it('should remove components not found in user bundles if includeBundledOnly is true', () => {
      const bundles: Bundle[] = [
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
      const bundles: Bundle[] = [];
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

  describe('validateDependentCollection', () => {

    it('should set includeBundledOnly', () => {
      const collection = validateDependentCollection({
        name: '@mycollection/core',
        includeBundledOnly: true
      });
      expect(collection.includeBundledOnly).toBe(true);
    });

    it('should use the same collection object', () => {
      const collection = validateDependentCollection({
        name: '@mycollection/core'
      });
      expect(collection.name).toBe('@mycollection/core');
      expect(collection.includeBundledOnly).toBe(false);
    });

    it('should convert a string value to a collection object', () => {
      const collection = validateDependentCollection('@mycollection/core');
      expect(collection.name).toBe('@mycollection/core');
      expect(collection.includeBundledOnly).toBe(false);
    });

  });

});
