import * as d from '../../../declarations';
import { crawlAnchorsForNextPathnames } from '../crawl-anchors';


describe('crawlAnchorsForNextPathnames', () => {

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

    const pathsnames = crawlAnchorsForNextPathnames(anchors);

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
    const pathsnames = crawlAnchorsForNextPathnames(anchors);

    expect(pathsnames[0].href).toBe('/');
    expect(pathsnames[1].href).toBe('./');
    expect(pathsnames).toHaveLength(2);
  });

});
