import * as d from '../../../declarations';
import { crawlAnchorsForNextUrls, normalizePrerenderLocation } from '../prerender-utils';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateConfig } from '../../config/validate-config';


describe('normalizeLocation', () => {

  const sys = mockStencilSystem();
  let config: d.Config;
  let outputTarget: d.OutputTargetWww;

  beforeEach(() => {
    outputTarget = {
      type: 'www',
      dir: '/User/some/path/www/',
      baseUrl: '/'
    };
    config = {
      sys: sys
    };
  });


  it('should not parse cuz of custom prerenderFilter', () => {
    outputTarget.prerenderFilter = () => {
      return false;
    };
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/aboutus';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p).toBe(null);
  });

  it('should parse cuz of custom prerenderFilter', () => {
    outputTarget.prerenderFilter = () => {
      return true;
    };
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/downloads/sales.html';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/downloads/sales.html');
    expect(p.path).toBe('/downloads/sales.html');
  });

  it('should not parse urls with default prerender filter that hates dots', () => {
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/downloads/sales.pdf';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p).toBe(null);
  });

  it('should parse urls that is the directory of the base url with the ending /', () => {
    outputTarget.baseUrl = '/madison/wisconsin/';
    const windowLocationHref = 'http://localhost:1234/madison/';
    const urlStr = './wisconsin/';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/madison/wisconsin/');
    expect(p.path).toBe('/madison/wisconsin/');
  });

  it('should parse urls that is the directory of the base url without the ending /', () => {
    outputTarget.baseUrl = '/madison/wisconsin/';
    const windowLocationHref = 'http://localhost:1234/madison/';
    const urlStr = './wisconsin';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/madison/wisconsin');
    expect(p.path).toBe('/madison/wisconsin');
  });

  it('should parse urls that start with the baseUrl', () => {
    outputTarget.baseUrl = '/docs/';
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/docs/overview';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/docs/overview');
    expect(p.path).toBe('/docs/overview');
  });

  it('should ignore urls that are below the baseUrl, rel location ref', () => {
    outputTarget.baseUrl = '/docs/';
    const windowLocationHref = 'http://localhost:1234/docs';
    const urlStr = './about-us';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p).toBe(null);
  });

  it('should ignore urls that are below the baseUrl', () => {
    outputTarget.baseUrl = '/docs/';
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/about-us';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p).toBe(null);
  });

  it('should ignore urls that are not on the same host', () => {
    const windowLocationHref = 'https://localhost:1234/some/link-a';
    const urlStr = 'https://some-other-domain.org/some/link-b';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p).toBe(null);
  });

  it('should handle relative protocol', () => {
    const windowLocationHref = 'https://somedomain.org/some/link-a';
    const urlStr = '//somedomain.org/some/link-b';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('https://somedomain.org/some/link-b');
    expect(p.path).toBe('/some/link-b');
  });

  it('should path when using href with the same host', () => {
    const windowLocationHref = 'https://localhost:1234/some/link-a';
    const urlStr = 'https://localhost:1234/some/link-b';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('https://localhost:1234/some/link-b');
    expect(p.path).toBe('/some/link-b');
  });

  it('should get relative, one deeper directory url', () => {
    const windowLocationHref = 'https://localhost:1234/some/link-a';
    const urlStr = 'link-b/link-c';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('https://localhost:1234/some/link-b/link-c');
    expect(p.path).toBe('/some/link-b/link-c');
  });

  it('should get relative, up one directory url', () => {
    const windowLocationHref = 'http://localhost:1234/some/crazy/link-a';
    const urlStr = '../link-b';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/some/link-b');
    expect(p.path).toBe('/some/link-b');
  });

  it('should get relative, same directory url, with prefix ./', () => {
    const windowLocationHref = 'http://somedomain.org/some/crazy/link-a';
    const urlStr = './link-b';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://somedomain.org/some/crazy/link-b');
    expect(p.path).toBe('/some/crazy/link-b');
  });

  it('should get relative, same directory url', () => {
    const windowLocationHref = 'http://localhost:1234/some/crazy/link-a';
    const urlStr = 'link-b';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/some/crazy/link-b');
    expect(p.path).toBe('/some/crazy/link-b');
  });

  it('should get absolute url', () => {
    const windowLocationHref = 'http://localhost:1234/some/link-a';
    const urlStr = '/link-b/link-c';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/link-b/link-c');
    expect(p.path).toBe('/link-b/link-c');
  });

  it('should get the homepages url', () => {
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/');
    expect(p.path).toBe('/');
  });

  it('should include querystring and hash within path', () => {
    outputTarget.prerenderPathQuery = true;
    outputTarget.prerenderPathHash = true;
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/?some=query&string=value#somehash';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/?some=query&string=value#somehash');
    expect(p.path).toBe('/?some=query&string=value#somehash');
  });

  it('should include querystring within path', () => {
    outputTarget.prerenderPathQuery = true;
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/?some=query&string=value';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/?some=query&string=value');
    expect(p.path).toBe('/?some=query&string=value');
  });

  it('should include hash within path', () => {
    outputTarget.prerenderPathHash = true;
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/#somehash';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/#somehash');
    expect(p.path).toBe('/#somehash');
  });

  it('should ignore hash by default', () => {
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/#somehash';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/');
    expect(p.path).toBe('/');
  });

  it('should ignore querystring by default', () => {
    const windowLocationHref = 'http://localhost:1234/';
    const urlStr = '/?some=qs&and=something';
    const p = normalizePrerenderLocation(config, outputTarget, windowLocationHref, urlStr);
    expect(p.url).toBe('http://localhost:1234/');
    expect(p.path).toBe('/');
  });

  it('should normalize and not have duplicate pending urls', () => {
    const prerenderQueue: d.PrerenderLocation[] = [];
    const windowLocationHref = 'http://docbrown.com';
    const anchors: d.HydrateAnchor[] = [
      { href: '/' },
      { href: '/?qs=1' },
      { href: '/#hash1' },
      { href: '/#hash2' },
      { href: '/page-1' },
      { href: '/page-1#hash3' },
      { href: '/page-2' },
      { href: '/page-2?qs=2' },
      { href: '/page-2?qs=3' },
    ];

    crawlAnchorsForNextUrls(config, outputTarget, prerenderQueue, windowLocationHref, anchors);

    expect(prerenderQueue).toHaveLength(3);
    expect(prerenderQueue[0].url).toBe('http://docbrown.com/');
    expect(prerenderQueue[0].path).toBe('/');
    expect(prerenderQueue[1].path).toBe('/page-1');
    expect(prerenderQueue[2].path).toBe('/page-2');
  });

  it('should handle quotes in pathnames', () => {
    const prerenderQueue: d.PrerenderLocation[] = [];
    const windowLocationHref = 'http://docbrown.com';
    const anchors: d.HydrateAnchor[] = [
      { href: `/` },
      { href: `'./` },
      { href: `"./` },
      { href: `"./'` },
      { href: '/#hash1' },
      { href: '/#hash2' },
      { href: '/?qs=1`' },
      { href: '/?qs=2`' },
    ];
    crawlAnchorsForNextUrls(config, outputTarget, prerenderQueue, windowLocationHref, anchors);

    expect(prerenderQueue).toHaveLength(1);
    expect(prerenderQueue[0].url).toBe('http://docbrown.com/');
    expect(prerenderQueue[0].path).toBe('/');
  });

});
