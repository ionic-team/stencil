import * as d from '../../../declarations';
import { generateServiceWorkerUrl } from '../service-worker-util';
import { TestingConfig } from '../../../testing/testing-config';
import { validateConfig } from '../../config/validate-config';


describe('generateServiceWorkerUrl', () => {

  let config: d.Config;
  let outputTarget: d.OutputTargetWww;

  it('sw url w/ baseUrl', () => {
    config = new TestingConfig();
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
    config = new TestingConfig();
    config.devMode = false;
    validateConfig(config);
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    const swUrl = generateServiceWorkerUrl(config, outputTarget);
    expect(swUrl).toBe('/sw.js');
  });

});


