import { Config, PrerenderConfig } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validatePrerenderConfig } from '../validate-prerender-config';


describe('prerender', () => {

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
      expect((config.prerender as PrerenderConfig).include[0].path).toBe('/');
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

    it('should always set es5 build when prerendering', () => {
      config.prerender = true;
      validatePrerenderConfig(config);
      expect(config.buildEs5).toBe(true);
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

});
