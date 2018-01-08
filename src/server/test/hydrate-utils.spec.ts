import { BuildConfig } from '../../util/interfaces';
import { normalizeHydrateOptions } from '../hydrate-utils';
import { mockBuildConfig } from '../../testing/mocks';


describe('normalizeHydrateOptions', () => {

  it('get hydrate options from express request', () => {
    const opts = normalizeHydrateOptions({
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

  it('set keep querystring and hash', () => {
    const opts = normalizeHydrateOptions({
      url: 'http://whatever.com/hello-path?hello=query#hellohash'
    });
    expect(opts.url).toBe('http://whatever.com/hello-path?hello=query#hellohash');
  });


  var config: BuildConfig;

  beforeEach(() => {
    config = mockBuildConfig();
  });

});
