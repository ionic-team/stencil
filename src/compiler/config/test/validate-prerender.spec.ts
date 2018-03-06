import { Config, PrerenderConfig } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validatePrerenderConfig } from '../validate-prerender-config';


describe('validatePrerenderConfig', () => {

  let config: Config;

  beforeEach(() => {
    config = {
      sys: mockStencilSystem(),
      logger: mockLogger(),
      rootDir: '/User/some/path/',
      srcDir: '/User/some/path/src/',
      outputTargets: {
        www: {
          dir: '/User/some/path/www/',
        }
      },
      suppressTypeScriptErrors: true
    };
  });

  it('should set prerender.maxConcurrent', () => {
    config.prerender = {
      maxConcurrent: 8
    };
    validatePrerenderConfig(config);
    expect((config.prerender as PrerenderConfig).maxConcurrent).toBe(8);
  });

  it('should default prerender.maxConcurrent', () => {
    config.prerender = true;
    validatePrerenderConfig(config);
    expect((config.prerender as PrerenderConfig).maxConcurrent).toBe(4);
  });

  it('should default prerender.include', () => {
    config.prerender = true;
    validatePrerenderConfig(config);
    expect((config.prerender as PrerenderConfig).include[0].path).toBe('/');
  });

  it('should default prerender.crawl', () => {
    config.prerender = true;
    validatePrerenderConfig(config);
    expect((config.prerender as PrerenderConfig).crawl).toBe(true);
  });

  it('should set prerender.prerenderDir', () => {
    config.prerender = {
      prerenderDir: 'some-prerender-dir'
    };
    validatePrerenderConfig(config);
    expect(config.sys.path.basename(config.prerender.prerenderDir)).toBe('some-prerender-dir');
  });

  it('should default prerender.prerenderDir to www dir', () => {
    config.prerender = true;
    validatePrerenderConfig(config);
    expect((config.prerender as PrerenderConfig).prerenderDir).toBe(config.outputTargets.www.dir);
  });

  it('should default prerender.inlineStyles', () => {
    config.prerender = true;
    validatePrerenderConfig(config);
    expect((config.prerender as PrerenderConfig).inlineStyles).toBe(true);
  });

  it('should default prerender.removeUnusedStyles', () => {
    config.prerender = true;
    validatePrerenderConfig(config);
    expect((config.prerender as PrerenderConfig).removeUnusedStyles).toBe(true);
  });

  it('should default prerender.collapseWhitespace', () => {
    config.prerender = true;
    validatePrerenderConfig(config);
    expect((config.prerender as PrerenderConfig).collapseWhitespace).toBe(true);
  });

  it('should default prerender.inlineLoaderScript', () => {
    config.prerender = true;
    validatePrerenderConfig(config);
    expect((config.prerender as PrerenderConfig).inlineLoaderScript).toBe(true);
  });

  it('should default prerender values', () => {
    config.prerender = true;
    validatePrerenderConfig(config);
    expect(config.prerender).toBeDefined();
  });

  it('should always set es5 build when prerendering', () => {
    config.prerender = true;
    validatePrerenderConfig(config);
    expect(config.buildEs5).toBe(true);
  });

  it('should not set prerender if false', () => {
    config.prerender = null;
    validatePrerenderConfig(config);
    expect(config.prerender).toBe(null);
  });

  it('should not prerender if null', () => {
    config.prerender = null;
    validatePrerenderConfig(config);
    expect(config.prerender).toBe(null);
  });

  it('should set prerender null if dev mode', () => {
    config.prerender = false;
    config.devMode = true;
    validatePrerenderConfig(config);
    expect(config.prerender).toBe(null);
  });

  it('should set prerender no hydrate defaults when config.prerender false', () => {
    config.prerender = false;
    validatePrerenderConfig(config);
    const prerenderConfig: PrerenderConfig = config.prerender as any;
    expect(prerenderConfig).toBeDefined();
    expect(prerenderConfig.hydrateComponents).toBe(false);
  });

  it('should set prerendering no hydrate defaults if prerendering is not null and not devMode', () => {
    config.devMode = false;
    validatePrerenderConfig(config);
    const prerenderConfig: PrerenderConfig = config.prerender as any;
    expect(prerenderConfig).toBeDefined();
    expect(prerenderConfig.hydrateComponents).toBe(false);
    expect(prerenderConfig.crawl).toBe(false);
    expect(prerenderConfig.include).toEqual([{ path: '/' }]);
    expect(prerenderConfig.collapseWhitespace).toBe(true);
    expect(prerenderConfig.inlineLoaderScript).toBe(true);
    expect(prerenderConfig.inlineStyles).toBe(false);
    expect(prerenderConfig.inlineAssetsMaxSize).toBe(5000);
    expect(prerenderConfig.removeUnusedStyles).toBe(false);
  });

});
