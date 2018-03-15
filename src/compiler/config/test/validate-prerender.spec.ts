import * as d from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateConfig } from '../validate-config';


describe('validateConfig', () => {

  let config: d.Config;
  const logger = mockLogger();
  const sys = mockStencilSystem();

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/',
      suppressTypeScriptErrors: true,
    };
  });


  it('default no prerender if existing outputTargets, but no www', () => {
    const dist: d.OutputTargetDist = {
      type: 'dist'
    };
    config.outputTargets = [dist];
    validateConfig(config);
    expect(config.outputTargets.some(o => o.type === 'www')).toBe(false);
  });

  it('default prerender when flag true, prod mode, get custom www output values', () => {
    config.flags = { prerender: true };
    const www: d.OutputTargetWww = {
      type: 'www',
      dir: 'somedir',
      buildDir: 'someotherdir',
      indexHtml: 'some.html',
      empty: false,
      collapseWhitespace: false,
      baseUrl: '/docs'
    };
    config.outputTargets = [www];
    validateConfig(config);
    const outputTarget: d.OutputTargetWww = config.outputTargets.find(o => o.type === 'www');
    expect(outputTarget.dir).toContain('somedir');
    expect(outputTarget.buildDir).toContain('someotherdir');
    expect(outputTarget.indexHtml).toContain('some.html');
    expect(outputTarget.empty).toBe(false);
    expect(outputTarget.collapseWhitespace).toBe(false);
    expect(outputTarget.hydrateComponents).toBe(true);
    expect(outputTarget.baseUrl).toBe('/docs/');
    expect(outputTarget.prerenderLocations).toEqual([{ path: '/docs/' }]);
  });

  it('default prerender when flag true, prod mode', () => {
    config.flags = { prerender: true };
    validateConfig(config);

    const outputTarget: d.OutputTargetWww = config.outputTargets.find(o => o.type === 'www');
    expect(outputTarget.baseUrl).toBe('/');
    expect(outputTarget.canonicalLink).toBe(true);
    expect(outputTarget.collapseWhitespace).toBe(true);
    expect(outputTarget.hydrateComponents).toBe(true);
    expect(outputTarget.inlineStyles).toBe(true);
    expect(outputTarget.inlineLoaderScript).toBe(true);
    expect(outputTarget.inlineAssetsMaxSize).toBe(5000);
    expect(outputTarget.prerenderUrlCrawl).toBe(true);
    expect(outputTarget.prerenderLocations).toEqual([{ path: '/' }]);
    expect(outputTarget.prerenderPathHash).toBe(false);
    expect(outputTarget.prerenderPathQuery).toBe(false);
    expect(outputTarget.prerenderMaxConcurrent).toBe(4);
    expect(outputTarget.removeUnusedStyles).toBe(true);
  });

  it('defaults, prod mode, no hydrate prerender without prerender flag', () => {
    validateConfig(config);

    const outputTarget: d.OutputTargetWww = config.outputTargets.find(o => o.type === 'www');
    expect(outputTarget.baseUrl).toBe('/');
    expect(outputTarget.canonicalLink).toBe(false);
    expect(outputTarget.collapseWhitespace).toBe(true);
    expect(outputTarget.hydrateComponents).toBe(false);
    expect(outputTarget.inlineStyles).toBe(false);
    expect(outputTarget.inlineLoaderScript).toBe(true);
    expect(outputTarget.inlineAssetsMaxSize).toBe(0);
    expect(outputTarget.prerenderUrlCrawl).toBe(false);
    expect(outputTarget.prerenderLocations).toEqual([]);
    expect(outputTarget.prerenderPathHash).toBe(false);
    expect(outputTarget.prerenderPathQuery).toBe(false);
    expect(outputTarget.prerenderMaxConcurrent).toBe(0);
    expect(outputTarget.removeUnusedStyles).toBe(false);
  });

  it('defaults, dev mode, no prerender', () => {
    config.devMode = true;
    validateConfig(config);

    const outputTarget: d.OutputTargetWww = config.outputTargets.find(o => o.type === 'www');
    expect(outputTarget.baseUrl).toBe('/');
    expect(outputTarget.canonicalLink).toBe(false);
    expect(outputTarget.collapseWhitespace).toBe(false);
    expect(outputTarget.hydrateComponents).toBe(false);
    expect(outputTarget.inlineStyles).toBe(false);
    expect(outputTarget.inlineLoaderScript).toBe(false);
    expect(outputTarget.inlineAssetsMaxSize).toBe(0);
    expect(outputTarget.prerenderUrlCrawl).toBe(false);
    expect(outputTarget.prerenderLocations).toEqual([]);
    expect(outputTarget.prerenderPathHash).toBe(false);
    expect(outputTarget.prerenderPathQuery).toBe(false);
    expect(outputTarget.prerenderMaxConcurrent).toBe(0);
    expect(outputTarget.removeUnusedStyles).toBe(false);
  });

});
