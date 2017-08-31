import { BuildConfig } from '../../../util/interfaces';
import { mockFs, mockLogger, mockStencilSystem } from '../../../test';
import { normalizePrerenderUrl } from '../prerender-app';


describe('prerender', () => {

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
    suppressTypeScriptErrors: true
  };

});
