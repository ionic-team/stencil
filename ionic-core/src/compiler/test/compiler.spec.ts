import { compileTemplate } from '../compiler';
import { ComponentItem } from '../interfaces';


describe('compiler', () => {

  describe('compileTemplate', () => {

    it('should compile template', () => {
      let item: ComponentItem = {
        template: '<div>hello</div>'
      };

      compileTemplate(item);

      expect(item.templateRender.length > 0).toEqual(true);
      expect(item.errors.length).toEqual(0);
    });

    it('should get error for bad template', () => {
      let item: ComponentItem = {
        template: 'no root node should throw error'
      };

      compileTemplate(item);

      expect(item.errors.length > 0).toEqual(true);
    });

  });

});
