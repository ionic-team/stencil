import type * as d from '@stencil/core/declarations';
import { generateServiceWorkerUrl } from '../service-worker-util';
import { validateConfig } from '../../config/validate-config';
import { mockConfig } from '@stencil/core/testing';

describe('generateServiceWorkerUrl', () => {
  let userConfig: d.Config;
  let outputTarget: d.OutputTargetWww;

  it('sw url w/ baseUrl', () => {
    userConfig = mockConfig();
    userConfig.devMode = false;
    userConfig.outputTargets = [
      {
        type: 'www',
        baseUrl: '/docs',
      } as d.OutputTargetWww,
    ];
    const { config } = validateConfig(userConfig);
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    const swUrl = generateServiceWorkerUrl(outputTarget, outputTarget.serviceWorker as d.ServiceWorkerConfig);
    expect(swUrl).toBe('/docs/sw.js');
  });

  it('default sw url', () => {
    userConfig = mockConfig();
    userConfig.devMode = false;
    const { config } = validateConfig(userConfig);
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    const swUrl = generateServiceWorkerUrl(outputTarget, outputTarget.serviceWorker as d.ServiceWorkerConfig);
    expect(swUrl).toBe('/sw.js');
  });
});
