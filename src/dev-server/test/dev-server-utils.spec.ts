import { isCssFile, isHtmlFile } from '../dev-server-utils';

describe('dev-server-utils', () => {
  describe('isHtmlFile', () => {
    it.each(['.html', 'foo.html', 'foo/bar.html'])('returns true for .html files (%s)', (filename) => {
      expect(isHtmlFile(filename)).toEqual(true);
    });

    it.each(['.htm', 'foo.htm', 'foo/bar.htm'])('returns true for .htm files (%s)', (filename) => {
      expect(isHtmlFile(filename)).toEqual(true);
    });

    it.each(['.ht', 'foo.htmx', 'foo/bar.xaml'])('returns false for other types of files (%s)', (filename) => {
      expect(isHtmlFile(filename)).toEqual(false);
    });

    it.each(['.hTMl', 'foo.HTML', 'foo/bar.htmL'])('is case insensitive for filename (%s)', (filename) => {
      expect(isHtmlFile(filename)).toEqual(true);
    });
  });

  describe('isCssFile', () => {
    it('should return true for .css', () => {
      expect(isCssFile('.css')).toEqual(true);
      expect(isCssFile('foo.css')).toEqual(true);
      expect(isCssFile('bar/foo.css')).toEqual(true);
    });

    it('should return false for other types of files', () => {
      expect(isCssFile('.txt')).toEqual(false);
      expect(isCssFile('foo.sass')).toEqual(false);
      expect(isCssFile('bar/foo.htm')).toEqual(false);
    });

    it('should be case insensitive', () => {
      expect(isCssFile('.cSs')).toEqual(true);
      expect(isCssFile('foo.cSS')).toEqual(true);
      expect(isCssFile('bar/foo.CSS')).toEqual(true);
    });
  });
});
