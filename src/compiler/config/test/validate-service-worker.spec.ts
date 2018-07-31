import * as d from '../../../declarations';
import { mockStencilSystem } from '../../../testing/mocks';
import { normalizePath } from '../../../compiler/util';
import { validateServiceWorker } from '../validate-service-worker';

describe('validateServiceWorker', () => {

  const config: d.Config = {
    fsNamespace: 'app',
    sys: mockStencilSystem(),
    devMode: false,
    flags: {}
  };

  let outputTarget: d.OutputTargetWww;


  it('should add host.config.json to globIgnores', () => {
    outputTarget = {
      type: 'www',
      dir: '/User/me/app/www/'
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker.globIgnores).toContain('**/host.config.json');
  });

  it('should add global.js to globIgnores', () => {
    outputTarget = {
      type: 'www',
      dir: '/User/me/app/www/'
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker.globIgnores).toContain('**/app.global.js');
  });

  it('should add registry.json to globIgnores', () => {
    outputTarget = {
      type: 'www',
      dir: '/User/me/app/www/'
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker.globIgnores).toContain('**/app.registry.json');
  });

  it('should set globIgnores from string', () => {
    outputTarget = {
      type: 'www',
      dir: '/User/me/app/www/',
      serviceWorker: {
        globIgnores: '**/some-file.js'
      }
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker.globIgnores).toContain('**/some-file.js');
  });

  it('should set globDirectory', () => {
    outputTarget = {
      type: 'www',
      dir: '/User/me/app/www/',
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
      dir: '/User/me/app/www/'
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker.globDirectory).toBe('/User/me/app/www/');
  });

  it('should set globPatterns array', () => {
    outputTarget = {
      type: 'www',
      dir: '/www',
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
      dir: '/www',
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
      dir: '/www'
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker.globPatterns).toEqual(['**/*.{js,css,json,html,ico,png,svg}']);
  });

  it('should create default sw config when www type and prod mode', () => {
    outputTarget = {
      type: 'www',
      dir: '/www'
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).not.toBe(null);
  });

  it('should not create default sw config when www type and devMode', () => {
    outputTarget = {
      type: 'www',
      dir: '/www'
    };
    config.devMode = true;
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).toBe(null);
  });

  it('should not create default sw config when not www type', () => {
    outputTarget = {
      type: 'www',
      dir: '/www'
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).toBe(null);
  });

  it('should create default sw config when true boolean, even if devMode', () => {
    outputTarget = {
      type: 'www',
      dir: '/www',
      serviceWorker: true as any
    };
    config.devMode = true;
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).not.toBe(true);
  });

  it('should not create sw config when in devMode', () => {
    outputTarget = {
      type: 'www',
      dir: '/www',
      serviceWorker: true as any
    };
    config.devMode = true;
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).toBe(null);
  });

  it('should create sw config when in devMode if flag serviceWorker', () => {
    outputTarget = {
      dir: '/www',
      serviceWorker: true as any
    };
    config.devMode = true;
    config.flags.serviceWorker = true;
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).not.toBe(null);
  });

  it('should do nothing when falsy', () => {
    outputTarget = {
      type: 'www',
      serviceWorker: null
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).toBe(null);

    outputTarget = {
      type: 'www',
      serviceWorker: false as any
    };
    validateServiceWorker(config, outputTarget);
    expect(outputTarget.serviceWorker).toBe(null);
  });

});
