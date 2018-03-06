import { Config, ServiceWorkerConfig } from '../../../util/interfaces';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateServiceWorkerConfig } from '../validate-sw-config';
import { normalizePath } from '../../../compiler/util';


describe('service worker', () => {

  describe('validateServiceWorkerConfig', () => {

    it('should set globDirectory', () => {
      config.serviceWorker = {
        globDirectory: '/custom/www'
      };
      validateServiceWorkerConfig(config);
      const swConfig = config.serviceWorker as ServiceWorkerConfig;
      expect(swConfig.globDirectory).toBe('/custom/www');
    });

    it('should set default globDirectory', () => {
      config.serviceWorker = true;
      validateServiceWorkerConfig(config);
      const swConfig = config.serviceWorker as ServiceWorkerConfig;
      expect(swConfig.globDirectory).toBe('/User/me/app/www/');
    });

    it('should set globPatterns', () => {
      config.serviceWorker = {
        globPatterns: ['**/*.{png,svg}']
      };
      validateServiceWorkerConfig(config);
      const swConfig = config.serviceWorker as ServiceWorkerConfig;
      expect(swConfig.globPatterns).toEqual(['**/*.{png,svg}']);
    });

    it('should create default globPatterns', () => {
      config.serviceWorker = true;
      validateServiceWorkerConfig(config);
      const swConfig = config.serviceWorker as ServiceWorkerConfig;
      expect(swConfig.globPatterns).toEqual(['**/*.{js,css,json,html,ico,png,svg}']);
    });

    it('should create default sw config when true boolean', () => {
      config.serviceWorker = true;
      validateServiceWorkerConfig(config);
      expect(config.serviceWorker).not.toBe(true);
    });

    it('should do nothing when falsy', () => {
      config.serviceWorker = null;
      validateServiceWorkerConfig(config);
      expect(config.serviceWorker).toBe(null);

      config.serviceWorker = false;
      validateServiceWorkerConfig(config);
      expect(config.serviceWorker).toBe(null);
    });


    const config: Config = {
      sys: mockStencilSystem(),
      outputTargets: {
        www: {
          dir: '/User/me/app/www/'
        }
      }
    };

    beforeEach(() => {
      delete config.serviceWorker;
    });

  });

});
