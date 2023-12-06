import { mockConfig, mockLoadConfigInit } from '@stencil/core/testing';
import { validateConfig } from '../../config/validate-config';
import { generateServiceWorkerUrl } from '../service-worker-util';
describe('generateServiceWorkerUrl', () => {
    let userConfig;
    let outputTarget;
    it('sw url w/ baseUrl', () => {
        userConfig = mockConfig({
            devMode: false,
            outputTargets: [
                {
                    type: 'www',
                    baseUrl: '/docs',
                },
            ],
        });
        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        outputTarget = config.outputTargets[0];
        const swUrl = generateServiceWorkerUrl(outputTarget, outputTarget.serviceWorker);
        expect(swUrl).toBe('/docs/sw.js');
    });
    it('default sw url', () => {
        userConfig = mockConfig({ devMode: false });
        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        outputTarget = config.outputTargets[0];
        const swUrl = generateServiceWorkerUrl(outputTarget, outputTarget.serviceWorker);
        expect(swUrl).toBe('/sw.js');
    });
});
//# sourceMappingURL=service-worker-util.spec.js.map