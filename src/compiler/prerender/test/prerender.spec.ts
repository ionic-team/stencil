import { BuildConfig, PrerenderConfig } from '../../../util/interfaces';
import { mockFs, mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { normalizePrerenderUrl } from '../prerender-app';
import { validatePrerenderConfig } from '../validate-prerender-config';


describe('prerender', () => {

  describe('validatePrerenderConfig', () => {

    it('should set prerenderIndex.maxConcurrent', () => {
      config.prerender = {
        maxConcurrent: 8
      };
      validatePrerenderConfig(config);
      expect((config.prerender as PrerenderConfig).maxConcurrent).toBe(8);
    });

    it('should default prerenderIndex.maxConcurrent', () => {
      config.prerender = true;
      validatePrerenderConfig(config);
      expect((config.prerender as PrerenderConfig).maxConcurrent).toBe(4);
    });

    it('should default prerenderIndex.include', () => {
      config.prerender = true;
      validatePrerenderConfig(config);
      expect((config.prerender as PrerenderConfig).include[0].url).toBe('/');
    });

    it('should default prerenderIndex.crawl', () => {
      config.prerender = true;
      validatePrerenderConfig(config);
      expect((config.prerender as PrerenderConfig).crawl).toBe(true);
    });

    it('should set prerenderIndex.prerenderDir', () => {
      config.prerender = {
        prerenderDir: 'some-prerender-dir'
      };
      validatePrerenderConfig(config);
      expect(config.sys.path.basename(config.prerender.prerenderDir)).toBe('some-prerender-dir');
    });

    it('should default prerenderIndex.prerenderDir to wwwDir', () => {
      config.prerender = true;
      validatePrerenderConfig(config);
      expect((config.prerender as PrerenderConfig).prerenderDir).toBe(config.wwwDir);
    });

    it('should default prerenderIndex.inlineStyles', () => {
      config.prerender = true;
      validatePrerenderConfig(config);
      expect((config.prerender as PrerenderConfig).inlineStyles).toBe(true);
    });

    it('should default prerenderIndex.removeUnusedStyles', () => {
      config.prerender = true;
      validatePrerenderConfig(config);
      expect((config.prerender as PrerenderConfig).removeUnusedStyles).toBe(true);
    });

    it('should default prerenderIndex.collapseWhitespace', () => {
      config.prerender = true;
      validatePrerenderConfig(config);
      expect((config.prerender as PrerenderConfig).collapseWhitespace).toBe(true);
    });

    it('should default prerenderIndex.inlineLoaderScript', () => {
      config.prerender = true;
      validatePrerenderConfig(config);
      expect((config.prerender as PrerenderConfig).inlineLoaderScript).toBe(true);
    });

    it('should default prerenderIndex values', () => {
      config.prerender = true;
      validatePrerenderConfig(config);
      expect(config.prerender).toBeDefined();
    });

    it('should not set prerenderIndex if false', () => {
      config.prerender = null;
      validatePrerenderConfig(config);
      expect(config.prerender).toBe(null);
    });

    it('should not set prerenderIndex if null', () => {
      config.prerender = false;
      validatePrerenderConfig(config);
      expect(config.prerender).toBe(null);
    });

  });

  describe('normalizePrerenderUrl', () => {

    it('should get relative, one deeper directory url', () => {
      const windowLocationHref = 'http://localhost:1234/some/link-a';
      const urlStr = 'link-b/link-c';
      const p = normalizePrerenderUrl(config, windowLocationHref, urlStr);
      expect(p.pathname).toBe('/some/link-b/link-c');
      expect(p.url).toBe('http://localhost:1234/some/link-b/link-c');
    });

    it('should get relative, up one directory url', () => {
      const windowLocationHref = 'http://localhost:1234/some/crazy/link-a';
      const urlStr = '../link-b';
      const p = normalizePrerenderUrl(config, windowLocationHref, urlStr);
      expect(p.pathname).toBe('/some/link-b');
      expect(p.url).toBe('http://localhost:1234/some/link-b');
    });

    it('should get relative, same directory url, with prefix ./', () => {
      const windowLocationHref = 'http://localhost:1234/some/crazy/link-a';
      const urlStr = './link-b';
      const p = normalizePrerenderUrl(config, windowLocationHref, urlStr);
      expect(p.pathname).toBe('/some/crazy/link-b');
      expect(p.url).toBe('http://localhost:1234/some/crazy/link-b');
    });

    it('should get relative, same directory url', () => {
      const windowLocationHref = 'http://localhost:1234/some/crazy/link-a';
      const urlStr = 'link-b';
      const p = normalizePrerenderUrl(config, windowLocationHref, urlStr);
      expect(p.pathname).toBe('/some/crazy/link-b');
      expect(p.url).toBe('http://localhost:1234/some/crazy/link-b');
    });

    it('should get absolute url', () => {
      const windowLocationHref = 'http://localhost:1234/some/link-a';
      const urlStr = '/link-b/link-c';
      const p = normalizePrerenderUrl(config, windowLocationHref, urlStr);
      expect(p.pathname).toBe('/link-b/link-c');
      expect(p.url).toBe('http://localhost:1234/link-b/link-c');
    });

    it('should get the homepages url', () => {
      const windowLocationHref = 'http://localhost:1234/';
      const urlStr = '/';
      const p = normalizePrerenderUrl(config, windowLocationHref, urlStr);
      expect(p.pathname).toBe('/');
      expect(p.url).toBe('http://localhost:1234/');
    });

    it('should ignore querystring and hash', () => {
      const windowLocationHref = 'http://localhost:1234/';
      const urlStr = '/?some=qs&and=something#withhash';
      const p = normalizePrerenderUrl(config, windowLocationHref, urlStr);
      expect(p.pathname).toBe('/');
      expect(p.url).toBe('http://localhost:1234/');
    });

  });

  var config: BuildConfig = {
    sys: mockStencilSystem(),
    logger: mockLogger(),
    rootDir: '/User/some/path/',
    srcDir: '/User/some/path/src/',
    wwwDir: '/User/some/path/www/',
    generateWWW: true,
    suppressTypeScriptErrors: true
  };

});
