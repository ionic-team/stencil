import * as d from '../../../declarations';
import { getWritePathFromUrl } from '../prerender-utils';
import { TestingConfig } from '../../../testing';
import { validateConfig } from '../../config/validate-config';


describe('getWritePathFromUrl', () => {

  let config: d.Config;
  let outputTarget: d.OutputTargetWww;

  it('custom www dir with sub directories', () => {
    config = new TestingConfig();
    config.outputTargets = [
      {
        type: 'www',
        dir: 'some/crazy/path'
      } as d.OutputTargetWww
    ];
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www');
    const url = 'http://stenciljs.com/';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe('/some/crazy/path/index.html');
  });

  it('custom www dir', () => {
    config = new TestingConfig();
    config.outputTargets = [
      {
        type: 'www',
        dir: 'somepath'
      } as d.OutputTargetWww
    ];
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www');
    const url = 'http://stenciljs.com/docs/about/#safetydance';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe('/somepath/docs/about/index.html');
  });

  it('custome baseUrl', () => {
    config = new TestingConfig();
    config.outputTargets = [
      {
        type: 'www',
        dir: 'custom-dir',
        baseUrl: '/base-url'
      } as d.OutputTargetWww
    ];
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www');
    const url = 'http://stenciljs.com/base-url/';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe('/custom-dir/index.html');
  });

  it('defaults, ignore hash', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www');
    const url = 'http://stenciljs.com/docs/about/#safetydance';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe('/www/docs/about/index.html');
  });

  it('defaults, ignore querystring', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www');
    const url = 'http://stenciljs.com/docs/about?tainted=love';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe('/www/docs/about/index.html');
  });

  it('defaults, sub dir with trailing slash', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www');
    const url = 'http://stenciljs.com/docs/';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe('/www/docs/index.html');
  });

  it('defaults, sub dir no trailing slash', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www');
    const url = 'http://stenciljs.com/docs';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe('/www/docs/index.html');
  });

  it('defaults, root dir', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www');
    const url = 'http://stenciljs.com/';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe('/www/index.html');
  });

});
