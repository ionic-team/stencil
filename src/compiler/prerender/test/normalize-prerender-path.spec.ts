import * as d from '../../../declarations';
import { normalizePrerenderPath } from '../normalize-prerender-path';
import { URL } from 'url';


describe('normalizePrerenderPath', () => {
  let outputTarget: d.OutputTargetWww;

  beforeEach(() => {
    outputTarget = {
      type: 'www',
      dir: '/User/some/path/www/',
      baseUrl: '/'
    };
  });


  it('should not parse cuz of custom prerenderFilter', () => {
    outputTarget.prerenderFilter = () => {
      return false;
    };
    const windowLocationUrl = new URL('http://localhost:1234/');
    const urlStr = '/aboutus';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe(null);
  });

  it('should parse cuz of custom prerenderFilter', () => {
    outputTarget.prerenderFilter = () => {
      return true;
    };
    const windowLocationUrl = new URL('http://localhost:1234/');
    const urlStr = '/downloads/sales.html';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/downloads/sales.html');
  });

  it('should not parse urls with default prerender filter that hates dots', () => {
    const windowLocationUrl = new URL('http://localhost:1234/');
    const urlStr = '/downloads/sales.pdf';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe(null);
  });

  it('should parse urls that is the directory of the base url with the ending /', () => {
    outputTarget.baseUrl = '/madison/wisconsin/';
    const windowLocationUrl = new URL('http://localhost:1234/madison/');
    const urlStr = './wisconsin/';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/madison/wisconsin/');
  });

  it('should parse urls that is the directory of the base url without the ending /', () => {
    outputTarget.baseUrl = '/madison/wisconsin/';
    const windowLocationUrl = new URL('http://localhost:1234/madison/');
    const urlStr = './wisconsin';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/madison/wisconsin');
  });

  it('should parse urls that start with the baseUrl', () => {
    outputTarget.baseUrl = '/docs/';
    const windowLocationUrl = new URL('http://localhost:1234/');
    const urlStr = '/docs/overview';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/docs/overview');
  });

  it('should ignore urls that are below the baseUrl, rel location ref', () => {
    outputTarget.baseUrl = '/docs/';
    const windowLocationUrl = new URL('http://localhost:1234/docs');
    const urlStr = './about-us';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe(null);
  });

  it('should ignore urls that are below the baseUrl', () => {
    outputTarget.baseUrl = '/docs/';
    const windowLocationUrl = new URL('http://localhost:1234/');
    const urlStr = '/about-us';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe(null);
  });

  it('should ignore urls that are not on the same host', () => {
    const windowLocationUrl = new URL('https://localhost:1234/some/link-a');
    const urlStr = 'https://some-other-domain.org/some/link-b';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe(null);
  });

  it('should handle relative protocol', () => {
    const windowLocationUrl = new URL('https://somedomain.org/some/link-a');
    const urlStr = '//somedomain.org/some/link-b';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/some/link-b');
  });

  it('should path when using href with the same host', () => {
    const windowLocationUrl = new URL('https://localhost:1234/some/link-a');
    const urlStr = 'https://localhost:1234/some/link-b';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/some/link-b');
  });

  it('should get relative, one deeper directory url', () => {
    const windowLocationUrl = new URL('https://localhost:1234/some/link-a');
    const urlStr = 'link-b/link-c';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/some/link-b/link-c');
  });

  it('should get relative, up one directory url', () => {
    const windowLocationUrl = new URL('http://localhost:1234/some/crazy/link-a');
    const urlStr = '../link-b';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/some/link-b');
  });

  it('should get relative, same directory url, with prefix ./', () => {
    const windowLocationUrl = new URL('http://somedomain.org/some/crazy/link-a');
    const urlStr = './link-b';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/some/crazy/link-b');
  });

  it('should get relative, same directory url', () => {
    const windowLocationUrl = new URL('http://localhost:1234/some/crazy/link-a');
    const urlStr = 'link-b';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/some/crazy/link-b');
  });

  it('should get absolute url', () => {
    const windowLocationUrl = new URL('http://localhost:1234/some/link-a');
    const urlStr = '/link-b/link-c';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/link-b/link-c');
  });

  it('should get the homepages url', () => {
    const windowLocationUrl = new URL('http://localhost:1234/');
    const urlStr = '/';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/');
  });

  it('should include querystring and hash within path', () => {
    outputTarget.prerenderPathQuery = () => true;
    outputTarget.prerenderPathHash = () => true;
    const windowLocationUrl = new URL('http://localhost:1234/');
    const urlStr = '/?some=query&string=value#somehash';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/?some=query&string=value#somehash');
  });

  it('should include querystring within path', () => {
    outputTarget.prerenderPathQuery = () => true;
    const windowLocationUrl = new URL('http://localhost:1234/');
    const urlStr = '/?some=query&string=value';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/?some=query&string=value');
  });

  it('should include hash within path', () => {
    outputTarget.prerenderPathHash = () => true;
    const windowLocationUrl = new URL('http://localhost:1234/');
    const urlStr = '/#somehash';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/#somehash');
  });

  it('should ignore hash by default', () => {
    const windowLocationUrl = new URL('http://localhost:1234/');
    const urlStr = '/#somehash';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/');
  });

  it('should ignore querystring by default', () => {
    const windowLocationUrl = new URL('http://localhost:1234/');
    const urlStr = '/?some=qs&and=something';
    const p = normalizePrerenderPath(true, outputTarget, windowLocationUrl, urlStr);
    expect(p).toBe('/');
  });

});
