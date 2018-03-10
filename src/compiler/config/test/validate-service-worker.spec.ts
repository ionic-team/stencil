import { Config, OutputTarget, ServiceWorkerConfig } from '../../../declarations';
import { mockStencilSystem } from '../../../testing/mocks';
import { normalizePath } from '../../../compiler/util';
import { validateServiceWorker } from '../validate-service-worker';


describe('validateServiceWorker', () => {

  const config: Config = {
    sys: mockStencilSystem(),
    devMode: false
  };

  let outputTarget: OutputTarget;


  it('should set globDirectory', () => {
    outputTarget = {
      type: 'www',
      path: '/User/me/app/www/',
      serviceWorker: {
        globDirectory: '/custom/www'
      }
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker.globDirectory).toBe('/custom/www');
  });

  it('should set default globDirectory', () => {
    outputTarget = {
      type: 'www',
      path: '/User/me/app/www/'
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker.globDirectory).toBe('/User/me/app/www/');
  });

  it('should set globPatterns array', () => {
    outputTarget = {
      type: 'www',
      path: '/www',
      serviceWorker: {
        globPatterns: ['**/*.{png,svg}']
      }
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker.globPatterns).toEqual(['**/*.{png,svg}']);
  });

  it('should set globPatterns string', () => {
    outputTarget = {
      type: 'www',
      path: '/www',
      serviceWorker: {
        globPatterns: '**/*.{png,svg}' as any
      }
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker.globPatterns).toEqual(['**/*.{png,svg}']);
  });

  it('should create default globPatterns', () => {
    outputTarget = {
      type: 'www',
      path: '/www'
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker.globPatterns).toEqual(['**/*.{js,css,json,html,ico,png,svg}']);
  });

  it('should create default sw config when www type and prod mode', () => {
    outputTarget = {
      type: 'www',
      path: '/www'
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).not.toBe(null);
  });

  it('should not create default sw config when www type and devMode', () => {
    outputTarget = {
      type: 'www',
      path: '/www'
    };
    config.devMode = true;
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).toBe(null);
  });

  it('should not create default sw config when not www type', () => {
    outputTarget = {
      path: '/www'
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).toBe(null);
  });

  it('should create default sw config when true boolean, even if devMode', () => {
    outputTarget = {
      path: '/www',
      serviceWorker: true as any
    };
    config.devMode = true;
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).not.toBe(true);
  });

  it('should not create sw config when in devMode', () => {
    outputTarget = {
      path: '/www',
      serviceWorker: true as any
    };
    config.devMode = true;
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).toBe(null);
  });

  it('should do nothing when falsy', () => {
    outputTarget = {
      serviceWorker: null
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).toBe(null);

    outputTarget = {
      serviceWorker: false as any
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).toBe(null);
  });

});
