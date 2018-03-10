import { Config, OutputTarget, PrerenderConfig } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validatePrerender } from '../validate-prerender';


describe('validatePrerender', () => {

  let config: Config;
  let outputTarget: OutputTarget;

  beforeEach(() => {
    config = {
      sys: mockStencilSystem(),
      logger: mockLogger(),
      rootDir: '/User/some/path/',
      srcDir: '/User/some/path/src/',
      suppressTypeScriptErrors: true,
      flags: {}
    };
    outputTarget = {
      type: 'www',
      path: '/www'
    };
  });


  it('should set prerender no hydrate defaults when config.prerender false', () => {
    config.flags.prerender = true;
    outputTarget.prerender = false as any;
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender).toBeDefined();
    expect(outputTarget.prerender.hydrateComponents).toBe(false);
  });

  it('should set prerendering no hydrate defaults if prerendering is not null and not devMode', () => {
    config.flags.prerender = true;
    config.devMode = false;
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender).toBeDefined();
    expect(outputTarget.prerender.hydrateComponents).toBe(false);
    expect(outputTarget.prerender.crawl).toBe(false);
    expect(outputTarget.prerender.include).toEqual([{ path: '/' }]);
    expect(outputTarget.prerender.collapseWhitespace).toBe(true);
    expect(outputTarget.prerender.inlineLoaderScript).toBe(true);
    expect(outputTarget.prerender.inlineStyles).toBe(false);
    expect(outputTarget.prerender.inlineAssetsMaxSize).toBe(5000);
    expect(outputTarget.prerender.removeUnusedStyles).toBe(false);
  });

  it('should set prerender.maxConcurrent', () => {
    config.flags.prerender = true;
    outputTarget.prerender = {
      maxConcurrent: 8
    };
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender.maxConcurrent).toBe(8);
  });

  it('should default prerender.maxConcurrent', () => {
    config.flags.prerender = true;
    outputTarget.prerender = {};
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender.maxConcurrent).toBe(4);
  });

  it('should default prerender.include', () => {
    config.flags.prerender = true;
    outputTarget.prerender = undefined;
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender.include[0].path).toBe('/');
  });

  it('should default prerender.crawl', () => {
    config.flags.prerender = true;
    outputTarget.prerender = {};
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender.crawl).toBe(true);
  });

  it('should set prerender.prerenderDir', () => {
    config.flags.prerender = true;
    outputTarget.prerender = {
      prerenderDir: '/prerendered'
    };
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender.prerenderDir).toBe('/prerendered');
  });

  it('should default prerender.prerenderDir', () => {
    config.flags.prerender = true;
    outputTarget.prerender = {};
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender.prerenderDir).toBe('/www');
  });

  it('should default prerender.inlineStyles', () => {
    config.flags.prerender = true;
    outputTarget.prerender = {};
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender.inlineStyles).toBe(true);
  });

  it('should default prerender.removeUnusedStyles', () => {
    config.flags.prerender = true;
    outputTarget.prerender = {};
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender.removeUnusedStyles).toBe(true);
  });

  it('should default prerender.collapseWhitespace', () => {
    config.flags.prerender = true;
    outputTarget.prerender = {};
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender.collapseWhitespace).toBe(true);
  });

  it('should default prerender.inlineLoaderScript', () => {
    config.flags.prerender = true;
    outputTarget.prerender = {};
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender.inlineLoaderScript).toBe(true);
  });

  it('should always set es5 build when prerendering', () => {
    config.flags.prerender = true;
    outputTarget.prerender = {};
    validatePrerender(config, outputTarget);
    expect(config.buildEs5).toBe(true);
  });

  it('should set prerender null if dev mode', () => {
    outputTarget.prerender = {};
    config.devMode = true;
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender).toBe(null);
  });

  it('should default prerender if undefined and type www', () => {
    outputTarget.type = 'www';
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender).toBeDefined();
  });

  it('should default null prerender if undefined and not type www', () => {
    outputTarget.type = 'dist';
    outputTarget.path = '/dist';
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender).toBe(null);
  });

  it('should default prerender values when true', () => {
    config.flags.prerender = true;
    outputTarget.prerender = true as any;
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender).not.toBe(null);
    expect(outputTarget.prerender).not.toBe(true);
    expect(outputTarget.prerender).not.toBe(false);
  });

  it('should not prerender if null', () => {
    outputTarget.prerender = null;
    validatePrerender(config, outputTarget);
    expect(outputTarget.prerender).toBe(null);
  });

});
