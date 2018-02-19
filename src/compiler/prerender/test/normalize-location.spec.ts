import { Config } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { normalizePrerenderLocation } from '../prerender-utils';


describe('normalizeLocation', () => {

  let config: Config;

  beforeEach(() => {
    config = {
      sys: mockStencilSystem(),
      logger: mockLogger(),
      rootDir: '/User/some/path/',
      srcDir: '/User/some/path/src/',
      wwwDir: '/User/some/path/www/',
      generateWWW: true,
      suppressTypeScriptErrors: true
    };
  });


  it('should ignore urls that are not on the same host', () => {
    const windowLocationHref = 'https://somedomain.org/some/link-a';
    const urlStr = 'https://some-other-domain.org/some/link-b';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p).toBe(null);
  });

  it('should handle relative protocol', () => {
    const windowLocationHref = 'https://somedomain.org/some/link-a';
    const urlStr = '//somedomain.org/some/link-b';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('https://somedomain.org/some/link-b');
    expect(p.path).toBe('/some/link-b');
  });

  it('should path when using href with the same host', () => {
    const windowLocationHref = 'https://localhost:1234/some/link-a';
    const urlStr = 'https://localhost:1234/some/link-b';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('https://localhost:1234/some/link-b');
    expect(p.path).toBe('/some/link-b');
  });

  it('should get relative, one deeper directory url', () => {
    const windowLocationHref = 'https://localhost:1234/some/link-a';
    const urlStr = 'link-b/link-c';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('https://localhost:1234/some/link-b/link-c');
    expect(p.path).toBe('/some/link-b/link-c');
  });

  it('should get relative, up one directory url', () => {
    const windowLocationHref = 'http://localhost:1234/some/crazy/link-a';
    const urlStr = '../link-b';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/some/link-b');
    expect(p.path).toBe('/some/link-b');
  });

  it('should get relative, same directory url, with prefix ./', () => {
    const windowLocationHref = 'http://somedomain.org/some/crazy/link-a';
    const urlStr = './link-b';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('http://somedomain.org/some/crazy/link-b');
    expect(p.path).toBe('/some/crazy/link-b');
  });

  it('should get relative, same directory url', () => {
    const windowLocationHref = 'http://localhost:1234/some/crazy/link-a';
    const urlStr = 'link-b';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/some/crazy/link-b');
    expect(p.path).toBe('/some/crazy/link-b');
  });

  it('should get absolute url', () => {
    const windowLocationHref = 'http://localhost:1234/some/link-a';
    const urlStr = '/link-b/link-c';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/link-b/link-c');
    expect(p.path).toBe('/link-b/link-c');
  });

  it('should get the homepages url', () => {
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/');
    expect(p.path).toBe('/');
  });

  it('should include querystring and hash within path', () => {
    config.prerender = {
      includePathQuery: true,
      includePathHash: true
    };
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/?some=query&string=value#somehash';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/?some=query&string=value#somehash');
    expect(p.path).toBe('/?some=query&string=value#somehash');
  });

  it('should include querystring within path', () => {
    config.prerender = {
      includePathQuery: true
    };
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/?some=query&string=value';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/?some=query&string=value');
    expect(p.path).toBe('/?some=query&string=value');
  });

  it('should include hash within path', () => {
    config.prerender = {
      includePathHash: true
    };
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/#somehash';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/#somehash');
    expect(p.path).toBe('/#somehash');
  });

  it('should ignore hash by default', () => {
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/#somehash';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/');
    expect(p.path).toBe('/');
  });

  it('should ignore querystring by default', () => {
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/?some=qs&and=something';
    const p = normalizePrerenderLocation(config, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/');
    expect(p.path).toBe('/');
  });

});
