import { Bundle, Collection, Manifest } from '../../interfaces';
import { processDependentManifest } from '../manifest';
import { validateDependentCollection } from '../../validation';


describe('manifest', () => {

  describe('processDependentManifest', () => {

    it('should remove components not found in user bundles if includeBundledOnly is true', () => {
      const bundles: Bundle[] = [
        { components: ['cmp-a'] },
        { components: ['cmp-b', 'cmp-e'] }
      ];
      const dependentCollection: Collection = {
        name: '@awesome/collection',
        includeBundledOnly: true
      };
      const dependentManifest: Manifest = {
        components: [
          { tagNameMeta: 'cmp-a' },
          { tagNameMeta: 'cmp-b' },
          { tagNameMeta: 'cmp-c' },
          { tagNameMeta: 'cmp-d' },
          { tagNameMeta: 'cmp-e' }
        ]
      };

      const manifest = processDependentManifest(bundles, dependentCollection, dependentManifest);

      expect(manifest.components.length).toBe(3);
      expect(manifest.components[0].tagNameMeta).toBe('cmp-a');
      expect(manifest.components[1].tagNameMeta).toBe('cmp-b');
      expect(manifest.components[2].tagNameMeta).toBe('cmp-e');
    });

    it('should keep all components if includeBundledOnly is falsy', () => {
      const bundles: Bundle[] = [];
      const dependentCollection: Collection = { name: '@awesome/collection' };
      const dependentManifest: Manifest = {
        components: [
          { tagNameMeta: 'cmp-a' },
          { tagNameMeta: 'cmp-b' },
          { tagNameMeta: 'cmp-c' }
        ]
      };

      const manifest = processDependentManifest(bundles, dependentCollection, dependentManifest);

      expect(manifest.components.length).toBe(3);
    });

  });

  describe('validateDependentCollection', () => {

    it('should set includeBundledOnly', () => {
      const collection = validateDependentCollection({
        name: '@ionic/core',
        includeBundledOnly: true
      });
      expect(collection.includeBundledOnly).toBe(true);
    });

    it('should use the same collection object', () => {
      const collection = validateDependentCollection({
        name: '@ionic/core'
      });
      expect(collection.name).toBe('@ionic/core');
      expect(collection.includeBundledOnly).toBe(false);
    });

    it('should convert a string value to a collection object', () => {
      const collection = validateDependentCollection('@ionic/core');
      expect(collection.name).toBe('@ionic/core');
      expect(collection.includeBundledOnly).toBe(false);
    });

  });

});
