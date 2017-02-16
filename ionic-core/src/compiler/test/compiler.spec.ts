import { compileTemplate } from '../index';
import { ComponentItem } from '../interfaces';


describe('compiler', () => {

  describe('compileTemplate', () => {

    it('should get error for bad template', () => {
      let item: ComponentItem = {
        templateContent: 'no root node should throw error'
      };

      compileTemplate(item);

      expect(item.errors.length > 0).toEqual(true);
    });

  });

});
