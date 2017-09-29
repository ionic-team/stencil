import { ssrPathRegex } from '../express-middleware';


describe('express-middleware', () => {

  describe('ssrPathRegex', () => {

    it('should not match when basename has an extension and has a querystring', () => {
      expect(ssrPathRegex.test('/build/some.js?some=path')).toBe(false);
    });

    it('should not match when basename has an extension', () => {
      expect(ssrPathRegex.test('/build/some.js')).toBe(false);
    });

    it('should match for an empty basename with querystring', () => {
      expect(ssrPathRegex.test('/about/?some=query')).toBe(true);
    });

    it('should match for an empty basename', () => {
      expect(ssrPathRegex.test('/about/')).toBe(true);
    });

    it('should match for a basename with no extension and has a querystring', () => {
      expect(ssrPathRegex.test('/about?some=query')).toBe(true);
    });

    it('should match for a basename with no extension', () => {
      expect(ssrPathRegex.test('/about')).toBe(true);
    });

    it('should match for index.html as the basename', () => {
      expect(ssrPathRegex.test('/index.html')).toBe(true);
    });

    it('should match for /', () => {
      expect(ssrPathRegex.test('/')).toBe(true);
    });

  });

});
