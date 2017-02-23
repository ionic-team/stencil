import { compileTemplate } from '../template-compiler';


describe('compiler', () => {

  describe('compileTemplate', () => {

    it('should compile template', () => {
      let c = compileTemplate('<div>hello</div>');

      expect(c.errors && c.errors[0]).toEqual(undefined);
      expect(c.templateRenderSource.length > 0).toEqual(true);
    });

    it('should get error for bad template', () => {
      let c = compileTemplate('<template key="asdf">');

      expect(c.errors.length > 0).toEqual(true);
    });

  });

});
