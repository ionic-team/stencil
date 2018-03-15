import * as d from '../../declarations';
import { mockConfig } from '../../testing/mocks';
import { normalizeHydrateOptions } from '../hydrate-utils';


describe('normalizeHydrateOptions', () => {

  let config: d.Config;
  let wwwTarget: d.OutputTargetWww;

  beforeEach(() => {
    config = mockConfig();
    wwwTarget = config.outputTargets.find(o => o.type === 'www');
  });


  it('get hydrate options from express request', () => {
    const opts = normalizeHydrateOptions(wwwTarget, {
      req: {
        protocol: 'https',
        originalUrl: '/org-url',
        get: function(key: string) {
          switch (key) {
            case 'host':
              return 'host.com';
            case 'referrer':
              return 'referrer';
            case 'user-agent':
              return 'user-agent';
            case 'cookie':
              return 'cookie';
          }
          return '';
        }
      }
    });
    expect(opts.url).toBe('https://host.com/org-url');
    expect(opts.referrer).toBe('referrer');
    expect(opts.userAgent).toBe('user-agent');
    expect(opts.cookie).toBe('cookie');
  });

  it('keep querystring and hash', () => {
    const hydrateTarget = normalizeHydrateOptions(wwwTarget, {
      url: 'http://whatever.com/hello-path?hello=query#hellohash'
    });
    expect(hydrateTarget.url).toBe('http://whatever.com/hello-path?hello=query#hellohash');
  });

  it('set html', () => {
    const hydrateTarget = normalizeHydrateOptions(wwwTarget, {
      html: '<red-balloons>99</red-balloons>'
    });
    expect(hydrateTarget.html).toBe('<red-balloons>99</red-balloons>');
  });

  it('get values from www target', () => {
    wwwTarget.canonicalLink = true;
    wwwTarget.collapseWhitespace = true;
    wwwTarget.prerenderLocations = [{ path: '/whatever' }];
    const hydrateTarget = normalizeHydrateOptions(wwwTarget, {});
    expect(hydrateTarget.dir).toContain('www');
    expect(hydrateTarget.buildDir).toContain('build');
    expect(hydrateTarget.canonicalLink).toBe(true);
    expect(hydrateTarget.collapseWhitespace).toBe(true);
    expect(hydrateTarget.prerenderLocations).toEqual([{ path: '/whatever' }]);
  });

});
