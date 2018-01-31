import * as util from '../util';


describe('util', () => {

  describe('normalizePath', () => {

    it('remove trailing slash, windows', () => {
      const path = util.normalizePath(`C:\\Johnny\\B\\Goode\\`);
      expect(path).toBe(`C:/Johnny/B/Goode`);
    });

    it('normalize file, windows', () => {
      const path = util.normalizePath(`C:\\Johnny\\B\\Goode.js`);
      expect(path).toBe(`C:/Johnny/B/Goode.js`);
    });

    it('not remove trailing slash for root dir, windows', () => {
      const path = util.normalizePath(`C:\\`);
      expect(path).toBe(`C:/`);
    });

    it('not remove trailing slash for root dir, unix', () => {
      const path = util.normalizePath(`/`);
      expect(path).toBe(`/`);
    });

    it('remove trailing slash, unix', () => {
      const path = util.normalizePath(`/Johnny/B/Goode/`);
      expect(path).toBe(`/Johnny/B/Goode`);
    });

    it('normalize file, unix', () => {
      const path = util.normalizePath(`/Johnny/B/Goode.js`);
      expect(path).toBe(`/Johnny/B/Goode.js`);
    });

    it('normalize file with spaces to trim', () => {
      const path = util.normalizePath(`    /Johnny/B/Goode.js    `);
      expect(path).toBe(`/Johnny/B/Goode.js`);
    });

    it('throw error when invalid string', () => {
      expect(() => {
        const path = util.normalizePath(null);
        expect(path).toBe(`/Johnny/B/Goode.js`);
      }).toThrow();
    });

  });

  describe('isTsFile', () => {
    it('should return true for regular .ts and .tsx files', () => {
      expect(util.isTsFile('.ts')).toEqual(true);
      expect(util.isTsFile('.tsx')).toEqual(true);
      expect(util.isTsFile('foo.ts')).toEqual(true);
      expect(util.isTsFile('foo.tsx')).toEqual(true);
      expect(util.isTsFile('foo.bar.ts')).toEqual(true);
      expect(util.isTsFile('foo.bar.tsx')).toEqual(true);
      expect(util.isTsFile('foo/bar.ts')).toEqual(true);
      expect(util.isTsFile('foo/bar.tsx')).toEqual(true);
    });

    it('should return false for other file extentions', () => {
      expect(util.isTsFile('foo.js')).toEqual(false);
      expect(util.isTsFile('foo.doc')).toEqual(false);
      expect(util.isTsFile('foo.css')).toEqual(false);
      expect(util.isTsFile('foo.html')).toEqual(false);
    });

    it('should return false for .d.ts and .d.tsx files', () => {
      expect(util.isTsFile('foo/bar.d.ts')).toEqual(false);
      expect(util.isTsFile('foo/bar.d.tsx')).toEqual(false);
    });

    it('should return false for .spec.ts and .spec.tsx files', () => {
      expect(util.isTsFile('foo/bar.spec.ts')).toEqual(false);
      expect(util.isTsFile('foo/bar.spec.tsx')).toEqual(false);
    });

    it('should return true for d.ts[x] and spec.ts[x] files', () => {
      expect(util.isTsFile('d.ts')).toEqual(true);
      expect(util.isTsFile('d.tsx')).toEqual(true);
      expect(util.isTsFile('spec.ts')).toEqual(true);
      expect(util.isTsFile('spec.tsx')).toEqual(true);
    });

    it('should be case insenitive', () => {
      expect(util.isTsFile('Foo.TS')).toEqual(true);
      expect(util.isTsFile('Foo.tSx')).toEqual(true);
      expect(util.isTsFile('foo/bar.D.ts')).toEqual(false);
      expect(util.isTsFile('foo/bar.D.tsx')).toEqual(false);
      expect(util.isTsFile('foo/bar.SpEc.ts')).toEqual(false);
      expect(util.isTsFile('foo/bar.sPEC.tsx')).toEqual(false);
    });
  });

  describe('isDtsFile', () => {
    it('should return true for .d.ts files', () => {
      expect(util.isDtsFile('.d.ts')).toEqual(true);
      expect(util.isDtsFile('foo.d.ts')).toEqual(true);
      expect(util.isDtsFile('foo/bar.d.ts')).toEqual(true);
    });

    it('should return false for all other file types', () => {
      expect(util.isDtsFile('.k.ts')).toEqual(false);
      expect(util.isDtsFile('foo.d.doc')).toEqual(false);
      expect(util.isDtsFile('foo/bar.txt')).toEqual(false);
      expect(util.isDtsFile('foo.spec.ts')).toEqual(false);
    });

    it('should be case insenitive', () => {
      expect(util.isDtsFile('foo/bar.D.tS')).toEqual(true);
    });
  });

  describe('isJsFile', () => {
    it('should return true for regular .js files', () => {
      expect(util.isJsFile('.js')).toEqual(true);
      expect(util.isJsFile('foo.js')).toEqual(true);
      expect(util.isJsFile('foo/bar.js')).toEqual(true);
      expect(util.isJsFile('spec.js')).toEqual(true);
    });

    it('should return false for other file extentions', () => {
      expect(util.isJsFile('.jsx')).toEqual(false);
      expect(util.isJsFile('foo.txt')).toEqual(false);
      expect(util.isJsFile('foo/bar.css')).toEqual(false);
    });

    it('should return false for .spec.js and .spec.jsx files', () => {
      expect(util.isJsFile('.spec.js')).toEqual(false);
      expect(util.isJsFile('foo.spec.js')).toEqual(false);
      expect(util.isJsFile('foo/bar.spec.js')).toEqual(false);
    });

    it('should be case insenitive', () => {
      expect(util.isJsFile('.Js')).toEqual(true);
      expect(util.isJsFile('foo.JS')).toEqual(true);
      expect(util.isJsFile('foo/bar.jS')).toEqual(true);
    });
  });

  describe('isSassFile', () => {
    it('should return true for .scss and .sass files', () => {
      expect(util.isSassFile('.scss')).toEqual(true);
      expect(util.isSassFile('foo.scss')).toEqual(true);
      expect(util.isSassFile('foo/bar.scss')).toEqual(true);
      expect(util.isSassFile('.sass')).toEqual(true);
      expect(util.isSassFile('foo.sass')).toEqual(true);
      expect(util.isSassFile('foo/bar.sass')).toEqual(true);
    });

    it('should return false for other types of files', () => {
      expect(util.isSassFile('.stss')).toEqual(false);
      expect(util.isSassFile('foo.html')).toEqual(false);
      expect(util.isSassFile('foo/bar.css')).toEqual(false);
    });

    it('should be case insensitive', () => {
      expect(util.isSassFile('.sCss')).toEqual(true);
      expect(util.isSassFile('foo.SCSS')).toEqual(true);
      expect(util.isSassFile('.sAss')).toEqual(true);
      expect(util.isSassFile('foo/bar.saSS')).toEqual(true);
    });
  });

  describe('isCssFile', () => {
    it('should return true for .css', () => {
      expect(util.isCssFile('.css')).toEqual(true);
      expect(util.isCssFile('foo.css')).toEqual(true);
      expect(util.isCssFile('bar/foo.css')).toEqual(true);
    });

    it('should return false for other types of files', () => {
      expect(util.isCssFile('.txt')).toEqual(false);
      expect(util.isCssFile('foo.sass')).toEqual(false);
      expect(util.isCssFile('bar/foo.htm')).toEqual(false);
    });

    it('should be case insensitive', () => {
      expect(util.isCssFile('.cSs')).toEqual(true);
      expect(util.isCssFile('foo.cSS')).toEqual(true);
      expect(util.isCssFile('bar/foo.CSS')).toEqual(true);
    });
  });

  describe('isHtmlFile', () => {
    it('should return true for .html and .htm files', () => {
      expect(util.isHtmlFile('.html')).toEqual(true);
      expect(util.isHtmlFile('foo.html')).toEqual(true);
      expect(util.isHtmlFile('foo/bar.html')).toEqual(true);
      expect(util.isHtmlFile('.htm')).toEqual(true);
      expect(util.isHtmlFile('foo.htm')).toEqual(true);
      expect(util.isHtmlFile('foo/bar.html')).toEqual(true);
    });

    it('should return false for other types of files', () => {
      expect(util.isHtmlFile('.ht')).toEqual(false);
      expect(util.isHtmlFile('foo.htmx')).toEqual(false);
      expect(util.isHtmlFile('foo/bar.xaml')).toEqual(false);
    });

    it('should be case insensitive', () => {
      expect(util.isHtmlFile('.hTMl')).toEqual(true);
      expect(util.isHtmlFile('foo.HTM')).toEqual(true);
      expect(util.isHtmlFile('foo/bar.htmL')).toEqual(true);
    });
  });

  describe('isWebDevFile', () => {
    it('should return true for all web dev file types', () => {
      expect(util.isWebDevFile('foo.ts')).toEqual(true);
      expect(util.isWebDevFile('foo.tsx')).toEqual(true);
      expect(util.isWebDevFile('foo.js')).toEqual(true);
      expect(util.isWebDevFile('foo.jsx')).toEqual(true);
      expect(util.isWebDevFile('foo.html')).toEqual(true);
      expect(util.isWebDevFile('foo.htm')).toEqual(true);
      expect(util.isWebDevFile('foo.css')).toEqual(true);
      expect(util.isWebDevFile('foo.scss')).toEqual(true);
      expect(util.isWebDevFile('foo.sass')).toEqual(true);
      expect(util.isWebDevFile('foo.less')).toEqual(true);
      expect(util.isWebDevFile('foo.styl')).toEqual(true);
    });

    it('should return false for d.ts file', () => {
      expect(util.isWebDevFile('components.d.ts')).toEqual(false);
    });

    it('should return false for other types of files', () => {
      expect(util.isWebDevFile('foo.txt')).toEqual(false);
    });

    it('should be case insensitive', () => {
      expect(util.isWebDevFile('foo.TS')).toEqual(true);
      expect(util.isWebDevFile('foo.tSx')).toEqual(true);
      expect(util.isWebDevFile('foo.JS')).toEqual(true);
    });
  });
});
