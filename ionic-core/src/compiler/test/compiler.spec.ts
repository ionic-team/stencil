import { compileTemplate } from '../compiler';
import { ComponentMeta } from '../interfaces';


describe('compiler', () => {

  describe('compileTemplate', () => {

    it('should compile template', () => {
      let m: ComponentMeta = {
        template: '<div>hello</div>'
      };

      compileTemplate(m);

      expect(m.templateRenderSource.length > 0).toEqual(true);
      expect(m.templateErrors.length).toEqual(0);
    });

    it('should get error for bad template', () => {
      let m: ComponentMeta = {
        template: 'no root node should throw error'
      };

      compileTemplate(m);

      expect(m.templateErrors.length > 0).toEqual(true);
    });

  });

});
