import * as d from '@stencil/core/declarations';
import { generateServiceWorkerUrl } from '../service-worker-util';
import { Config, validateConfig } from '@stencil/core/compiler';
import { mockConfig } from '@stencil/core/testing';


describe('generateServiceWorkerUrl', () => {

  let config: Config;
  let outputTarget: d.OutputTargetWww;

  it('sw url w/ baseUrl', () => {
    config = mockConfig();
    config.devMode = false;
    config.outputTargets = [
      {
        type: 'www',
        baseUrl: '/docs'
      } as d.OutputTargetWww
    ];
    validateConfig(config);
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    const swUrl = generateServiceWorkerUrl(config, outputTarget);
    expect(swUrl).toBe('/docs/sw.js');
  });

  it('default sw url', () => {
    config = mockConfig();
    config.devMode = false;
    validateConfig(config);
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    const swUrl = generateServiceWorkerUrl(config, outputTarget);
    expect(swUrl).toBe('/sw.js');
  });

});


