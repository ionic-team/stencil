import { validateDependentCollection } from '../validation';

describe('manifest', () => {

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
