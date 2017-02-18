import { compileTemplate } from '../compiler';
import { ComponentMeta } from '../interfaces';


describe('compiler', () => {

  describe('compileTemplate', () => {

    it('should compile template', () => {
      let m: ComponentMeta = {
        template: '<div>hello</div>'
      };

      compileTemplate(m);

      expect(m.errors && m.errors[0]).toEqual(undefined);
      expect(m.templateRenderSource.length > 0).toEqual(true);
    });

    it('should get error for bad template', () => {
      let m: ComponentMeta = {
        template: '<template key="asdf">'
      };

      compileTemplate(m);

      expect(m.errors.length > 0).toEqual(true);
    });

  });

});
