import * as d from '../../../declarations';
import { crawlAnchorsForNextUrlPaths } from '../crawl-anchors';


describe('crawlAnchorsForNextUrlPaths', () => {

  it('true for non _self target attr', () => {
    const r = crawlAnchorsForNextUrlPaths([{
      href: '/',
      target: '_blank'
    }]);
    expect(r).toEqual([]);
  });

  it('true for _SELF target attr', () => {
    const r = crawlAnchorsForNextUrlPaths([{
      href: '/',
      target: '_SELF'
    }]);
    expect(r).toEqual([{ href: '/' }]);
  });

  it('true for _self target attr', () => {
    const r = crawlAnchorsForNextUrlPaths([{
      href: '/',
      target: '_self'
    }]);
    expect(r).toEqual([{ href: '/' }]);
  });

  it('true for valid href attr', () => {
    const r = crawlAnchorsForNextUrlPaths([{
      href: '/'
    }]);
    expect(r).toEqual([{ href: '/' }]);
  });

  it('false for # href attr', () => {
    const r = crawlAnchorsForNextUrlPaths([{
      href: '#'
    }]);
    expect(r).toEqual([]);
  });

  it('false for spaces only href attr', () => {
    const r = crawlAnchorsForNextUrlPaths([{
      href: '    '
    }]);
    expect(r).toEqual([]);
  });

  it('false for empty href attr', () => {
    const r = crawlAnchorsForNextUrlPaths([{
      href: ''
    }]);
    expect(r).toEqual([]);
  });

  it('false for no href attr', () => {
    const r = crawlAnchorsForNextUrlPaths([{}]);
    expect(r).toEqual([]);
  });

  it('false for invalid anchor', () => {
    const r = crawlAnchorsForNextUrlPaths(null);
    expect(r).toEqual([]);
  });

  it('should normalize and not have duplicate pending urls', () => {
    const anchors: d.HydrateAnchorElement[] = [
      { href: '/' },
      { href: '/' },
      { href: '/?qs=1' },
      { href: '/?qs=1' },
      { href: '/#hash1' },
      { href: '/#hash2' },
      { href: '/#hash2' },
      { href: '/page-1' },
      { href: '/page-1' },
      { href: '/page-1#hash3' },
      { href: '/page-1#hash3' },
      { href: '/page-2' },
      { href: '/page-2' },
      { href: '/page-2?qs=2' },
      { href: '/page-2?qs=3' },
      { href: '/page-2?qs=3' },
    ];

    const pathsnames = crawlAnchorsForNextUrlPaths(anchors);

    expect(pathsnames[0].href).toBe('/');
    expect(pathsnames[1].href).toBe('/?qs=1');
    expect(pathsnames[2].href).toBe('/#hash1');
    expect(pathsnames[3].href).toBe('/#hash2');
    expect(pathsnames[4].href).toBe('/page-1');
    expect(pathsnames[5].href).toBe('/page-1#hash3');
    expect(pathsnames[6].href).toBe('/page-2');
    expect(pathsnames[7].href).toBe('/page-2?qs=2');
    expect(pathsnames[8].href).toBe('/page-2?qs=3');
    expect(pathsnames).toHaveLength(9);
  });

  it('should handle quotes in pathnames', () => {
    const anchors: d.HydrateAnchorElement[] = [
      { href: `/` },
      { href: `'./` },
      { href: `"./` },
      { href: `"./'` },
    ];
    const pathsnames = crawlAnchorsForNextUrlPaths(anchors);

    expect(pathsnames[0].href).toBe('/');
    expect(pathsnames[1].href).toBe('./');
    expect(pathsnames).toHaveLength(2);
  });

});
