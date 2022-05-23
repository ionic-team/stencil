import { isHtmlFile } from '../dev-server-utils';

describe('dev-server-utils', () => {
  describe('isHtmlFile', () => {
    it('should return true for .html and .htm files', () => {
      expect(isHtmlFile('.html')).toEqual(true);
      expect(isHtmlFile('foo.html')).toEqual(true);
      expect(isHtmlFile('foo/bar.html')).toEqual(true);
      expect(isHtmlFile('.htm')).toEqual(true);
      expect(isHtmlFile('foo.htm')).toEqual(true);
      expect(isHtmlFile('foo/bar.html')).toEqual(true);
    });

    it('should return false for other types of files', () => {
      expect(isHtmlFile('.ht')).toEqual(false);
      expect(isHtmlFile('foo.htmx')).toEqual(false);
      expect(isHtmlFile('foo/bar.xaml')).toEqual(false);
    });

    it('should be case insensitive', () => {
      expect(isHtmlFile('.hTMl')).toEqual(true);
      expect(isHtmlFile('foo.HTM')).toEqual(true);
      expect(isHtmlFile('foo/bar.htmL')).toEqual(true);
    });
  });
})
