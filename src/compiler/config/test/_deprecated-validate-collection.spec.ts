import { Collection } from '../../../declarations';
import { _deprecatedValidateConfigCollection } from '../_deprecated-validate-config-collection';


describe('_deprecated collection', () => {

  describe('_deprecatedValidateConfigCollection', () => {

    it('should use the same collection object', () => {
      const collection = _deprecatedValidateConfigCollection({
        name: '@mycollection/core'
      });
      expect(collection.name).toBe('@mycollection/core');
    });

    it('should convert a string value to a collection object', () => {
      const collection = _deprecatedValidateConfigCollection('@mycollection/core');
      expect(collection.name).toBe('@mycollection/core');
    });

  });

});
