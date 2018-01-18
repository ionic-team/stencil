import { DependentCollection, Manifest, ManifestBundle } from '../../../util/interfaces';
import { validateDependentCollection } from '../validate-collection';


describe('manifest', () => {

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
