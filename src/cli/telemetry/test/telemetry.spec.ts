import { getStencilCLIConfig, initializeStencilCLIConfig } from '@utils';
import * as telemetry from '../telemetry';
import * as shouldTrack from '../shouldTrack';
import { createSystem } from '../../../compiler/sys/stencil-sys';
import { mockLogger } from '@stencil/core/testing';
import { LoadConfigResults } from '../../../internal';

describe('telemetryBuildFinishedAction', () => {
  initializeStencilCLIConfig({
    sys: createSystem(),
    logger: mockLogger(),
    flags: { ci: false },
    validatedConfig: { config: { outputTargets: [] } } as LoadConfigResults,
    args: [],
  });

  it('issues a network request when complete', async () => {
    const spyShouldTrack = jest.spyOn(shouldTrack, 'shouldTrack');
    spyShouldTrack.mockReturnValue(
      new Promise((resolve) => {
        resolve(true);
      })
    );

    await telemetry.telemetryBuildFinishedAction({ componentGraph: [] });
    expect(spyShouldTrack).toHaveBeenCalled();

    spyShouldTrack.mockRestore();
  });
});

describe('telemetryAction', () => {
  it('issues a network request when no async function is passed', async () => {
    const spyShouldTrack = jest.spyOn(shouldTrack, 'shouldTrack');
    spyShouldTrack.mockReturnValue(
      new Promise((resolve) => {
        resolve(true);
      })
    );

    await telemetry.telemetryAction(() => {});
    expect(spyShouldTrack).toHaveBeenCalled();

    spyShouldTrack.mockRestore();
  });

  it('issues a network request when passed async function is complete', async () => {
    const spyShouldTrack = jest.spyOn(shouldTrack, 'shouldTrack');
    spyShouldTrack.mockReturnValue(
      new Promise((resolve) => {
        resolve(true);
      })
    );

    await telemetry.telemetryAction(async () => {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    });

    expect(spyShouldTrack).toHaveBeenCalled();

    spyShouldTrack.mockRestore();
  });
});

describe('checkTelemetry', () => {
  it('will read and write from a file, returning the correct status', async () => {
    await telemetry.enableTelemetry();
    expect(await telemetry.checkTelemetry()).toBe(true);
    await telemetry.disableTelemetry();
    expect(await telemetry.checkTelemetry()).toBe(false);
    await telemetry.enableTelemetry();
    expect(await telemetry.checkTelemetry()).toBe(true);
  });
});

describe('hasAppTarget', () => {
  beforeEach(() => {
    getStencilCLIConfig()?.resetInstance();

    initializeStencilCLIConfig({
      sys: createSystem(),
      logger: mockLogger(),
      flags: { ci: false },
      validatedConfig: { config: { outputTargets: [] } } as LoadConfigResults,
      args: [],
    });
  });

  it('Result is correct when outputTargets are empty', () => {
    getStencilCLIConfig().validatedConfig = { config: { outputTargets: [] } } as LoadConfigResults;
    expect(telemetry.hasAppTarget()).toBe(false);
  });

  it('Result is correct when outputTargets contains www with no baseUrl or serviceWorker', () => {
    getStencilCLIConfig().validatedConfig = { config: { outputTargets: [{ type: 'www' }] } } as LoadConfigResults;
    expect(telemetry.hasAppTarget()).toBe(false);
  });

  it('Result is correct when outputTargets contains www with default baseUrl value', () => {
    getStencilCLIConfig().validatedConfig = {
      config: { outputTargets: [{ type: 'www', baseUrl: '/' }] },
    } as LoadConfigResults;
    expect(telemetry.hasAppTarget()).toBe(false);
  });

  it('Result is correct when outputTargets contains www with serviceWorker', () => {
    getStencilCLIConfig().validatedConfig = {
      config: { outputTargets: [{ type: 'www', serviceWorker: { swDest: './tmp' } }] },
    } as LoadConfigResults;
    expect(telemetry.hasAppTarget()).toBe(true);
  });

  it('Result is correct when outputTargets contains www with baseUrl', () => {
    getStencilCLIConfig().validatedConfig = {
      config: { outputTargets: [{ type: 'www', baseUrl: 'https://example.com' }] },
    } as LoadConfigResults;
    expect(telemetry.hasAppTarget()).toBe(true);
  });

  it('Result is correct when outputTargets contains www with serviceWorker and baseUrl', () => {
    getStencilCLIConfig().validatedConfig = {
      config: { outputTargets: [{ type: 'www', baseUrl: 'https://example.com', serviceWorker: { swDest: './tmp' } }] },
    } as LoadConfigResults;
    expect(telemetry.hasAppTarget()).toBe(true);
  });
});

describe('prepareData', () => {
  beforeEach(() => {
    getStencilCLIConfig()?.resetInstance();

    initializeStencilCLIConfig({
      sys: createSystem(),
      logger: mockLogger(),
      flags: { ci: false },
      validatedConfig: { config: { outputTargets: [] } } as LoadConfigResults,
      args: [],
    });
  });

  it('provides an object', async () => {
    const data = await telemetry.prepareData(1000);
    expect(data).toEqual({
      arguments: undefined,
      build: 'unknown',
      component_count: undefined,
      cpu_model: '',
      duration_ms: 1000,
      has_app_pwa_config: false,
      os_name: '',
      os_version: '',
      packages: [],
      rollup: 'unknown',
      stencil: 'unknown',
      system: 'in-memory __VERSION:STENCIL__',
      targets: [],
      task: undefined,
      typescript: 'unknown',
      yarn: false,
    });
  });

  it('updates when there is a PWA config', async () => {
    getStencilCLIConfig().validatedConfig = {
      config: { outputTargets: [{ type: 'www', baseUrl: 'https://example.com', serviceWorker: { swDest: './tmp' } }] },
    } as LoadConfigResults;
    const data = await telemetry.prepareData(1000);
    expect(data).toEqual({
      arguments: undefined,
      build: 'unknown',
      component_count: undefined,
      cpu_model: '',
      duration_ms: 1000,
      has_app_pwa_config: true,
      os_name: '',
      os_version: '',
      packages: [],
      rollup: 'unknown',
      stencil: 'unknown',
      system: 'in-memory __VERSION:STENCIL__',
      targets: ['www'],
      task: undefined,
      typescript: 'unknown',
      yarn: false,
    });
  });

  it('updates when there is a component count passed in', async () => {
    getStencilCLIConfig().validatedConfig = {
      config: { outputTargets: [{ type: 'www', baseUrl: 'https://example.com', serviceWorker: { swDest: './tmp' } }] },
    } as LoadConfigResults;
    const data = await telemetry.prepareData(1000, 12);
    expect(data).toEqual({
      arguments: undefined,
      build: 'unknown',
      component_count: 12,
      cpu_model: '',
      duration_ms: 1000,
      has_app_pwa_config: true,
      os_name: '',
      os_version: '',
      packages: [],
      rollup: 'unknown',
      stencil: 'unknown',
      system: 'in-memory __VERSION:STENCIL__',
      targets: ['www'],
      task: undefined,
      typescript: 'unknown',
      yarn: false,
    });
  });
});
