import type * as d from '@stencil/core/declarations';
import { mockCompilerSystem, mockLogger, mockValidatedConfig } from '@stencil/core/testing';

import { createConfigFlags } from '../../../cli/config-flags';
import { validateServiceWorker } from '../validate-service-worker';

describe('validateServiceWorker', () => {
  let config: d.ValidatedConfig;

  beforeEach(() => {
    config = mockValidatedConfig({
      devMode: false,
      flags: createConfigFlags(),
      fsNamespace: 'app',
      hydratedFlag: null,
      logger: mockLogger(),
      outputTargets: [],
      packageJsonFilePath: '/package.json',
      rootDir: '/',
      sys: mockCompilerSystem(),
      testing: {},
      transformAliasedImportPaths: true,
    });
  });

  /**
   * A little util to work around a typescript annoyance. Because
   * `outputTarget.serviceWorker` is typed as
   * `serviceWorker?: ServiceWorkerConfig | null | false;` we get type errors
   * all over if we try to just access it directly. So instead, do a little
   * check to see if it's falsy. If not, we return it, and if it is we fail the test.
   *
   * @param serviceWorker The value returned from `validateServiceWorker`
   * @returns a serviceWorker object or `void`, with a `void` return being
   * accompanied by a manually-triggered test failure.
   */
  function getServiceWorker(serviceWorker: d.ValidatedOutputTargetWww['serviceWorker']) {
    if (serviceWorker) {
      return serviceWorker;
    } else {
      throw new Error('the serviceWorker on the provided target was unexpectedly falsy, so this test needs to fail!');
    }
  }

  it('should add host.config.json to globIgnores', () => {
    const validatedServiceWorker = validateServiceWorker(config, undefined, '/User/me/app/www/');
    expect(getServiceWorker(validatedServiceWorker).globIgnores).toContain('**/host.config.json');
  });

  it('should set globIgnores from string', () => {
    const validatedServiceWorker = validateServiceWorker(
      config,
      {
        globIgnores: '**/some-file.js',
      },
      '/User/me/app/www/',
    );
    expect(getServiceWorker(validatedServiceWorker).globIgnores).toContain('**/some-file.js');
  });

  it('should set globDirectory', () => {
    const validatedServiceWorker = validateServiceWorker(
      config,
      {
        globDirectory: '/custom/www',
      },
      '/User/me/app/www/',
    );
    expect(getServiceWorker(validatedServiceWorker).globDirectory).toBe('/custom/www');
  });

  it('should set default globDirectory', () => {
    const validatedServiceWorker = validateServiceWorker(config, undefined, '/User/me/app/www/');
    expect(getServiceWorker(validatedServiceWorker).globDirectory).toBe('/User/me/app/www/');
  });

  it('should set globPatterns array', () => {
    const validatedServiceWorker = validateServiceWorker(
      config,
      {
        globPatterns: ['**/*.{png,svg}'],
      },
      '/www',
    );
    expect(getServiceWorker(validatedServiceWorker).globPatterns).toEqual(['**/*.{png,svg}']);
  });

  it('should set globPatterns string', () => {
    const validatedServiceWorker = validateServiceWorker(
      config,
      {
        globPatterns: '**/*.{png,svg}' as any,
      },
      '/www',
    );
    expect(getServiceWorker(validatedServiceWorker).globPatterns).toEqual(['**/*.{png,svg}']);
  });

  it('should create default globPatterns', () => {
    const validatedServiceWorker = validateServiceWorker(config, undefined, '/www');
    expect(getServiceWorker(validatedServiceWorker).globPatterns).toEqual(['*.html', '**/*.{js,css,json}']);
  });

  it('should create default sw config when www type and prod mode', () => {
    const validatedServiceWorker = validateServiceWorker(config, undefined, '/www');
    expect(validatedServiceWorker).not.toBe(null);
  });

  it('should not create default sw config when www type and devMode', () => {
    config.devMode = true;
    const validatedServiceWorker = validateServiceWorker(config, undefined, '/www');
    expect(validatedServiceWorker).toBe(null);
  });

  it('should not create sw config when in devMode', () => {
    config.devMode = true;
    const validatedServiceWorker = validateServiceWorker(config, true as any, '/www');
    expect(validatedServiceWorker).toBe(null);
  });

  it('should create sw config when in devMode if flag serviceWorker', () => {
    config.devMode = true;
    config.flags.serviceWorker = true;
    const validatedServiceWorker = validateServiceWorker(config, true as any, '/www');
    expect(validatedServiceWorker).not.toBe(null);
  });

  it('should stay null', () => {
    const validatedServiceWorker = validateServiceWorker(config, null, '/www');
    expect(validatedServiceWorker).toBe(null);
  });

  it('should stay false', () => {
    const validatedServiceWorker = validateServiceWorker(config, false, '/www');
    expect(validatedServiceWorker).toBe(false);
  });
});
