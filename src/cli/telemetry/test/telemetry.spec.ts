import type * as d from '../../../declarations';
import * as telemetry from '../telemetry';
import * as shouldTrack from '../shouldTrack';
import { createSystem } from '../../../compiler/sys/stencil-sys';
import { mockLogger } from '@stencil/core/testing';
import * as coreCompiler from '@stencil/core/compiler';
import { anonymizeConfigForTelemetry } from '../telemetry';
import { DIST, DIST_CUSTOM_ELEMENTS, DIST_HYDRATE_SCRIPT, WWW } from '../../../compiler/output-targets/output-utils';

describe('telemetryBuildFinishedAction', () => {
  const config: d.Config = {
    outputTargets: [],
    flags: {
      args: [],
    },
  };

  const logger = mockLogger();
  const sys = createSystem();

  it('issues a network request when complete', async () => {
    const spyShouldTrack = jest.spyOn(shouldTrack, 'shouldTrack');
    spyShouldTrack.mockReturnValue(
      new Promise((resolve) => {
        resolve(true);
      })
    );

    const results = {
      componentGraph: {},
      duration: 100,
    } as d.CompilerBuildResults;

    await telemetry.telemetryBuildFinishedAction(sys, config, logger, coreCompiler, results);
    expect(spyShouldTrack).toHaveBeenCalled();

    spyShouldTrack.mockRestore();
  });
});

describe('telemetryAction', () => {
  const config = {
    outputTargets: [],
    flags: {
      args: [],
    },
  } as d.Config;
  const logger = mockLogger();
  const sys = createSystem();

  it('issues a network request when no async function is passed', async () => {
    const spyShouldTrack = jest.spyOn(shouldTrack, 'shouldTrack');
    spyShouldTrack.mockReturnValue(
      new Promise((resolve) => {
        resolve(true);
      })
    );

    await telemetry.telemetryAction(sys, config, logger, coreCompiler, () => {});
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

    await telemetry.telemetryAction(sys, config, logger, coreCompiler, async () => {
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
  const sys = createSystem();

  it('will read and write from a file, returning the correct status', async () => {
    await telemetry.enableTelemetry(sys);
    expect(await telemetry.checkTelemetry(sys)).toBe(true);
    await telemetry.disableTelemetry(sys);
    expect(await telemetry.checkTelemetry(sys)).toBe(false);
    await telemetry.enableTelemetry(sys);
    expect(await telemetry.checkTelemetry(sys)).toBe(true);
  });
});

describe('hasAppTarget', () => {
  it('Result is correct when outputTargets are empty', () => {
    const config = { outputTargets: [] } as d.Config;
    expect(telemetry.hasAppTarget(config)).toBe(false);
  });

  it('Result is correct when outputTargets contains www with no baseUrl or serviceWorker', () => {
    const config = { outputTargets: [{ type: WWW }] } as d.Config;
    expect(telemetry.hasAppTarget(config)).toBe(false);
  });

  it('Result is correct when outputTargets contains www with default baseUrl value', () => {
    const config = { outputTargets: [{ type: WWW, baseUrl: '/' }] } as d.Config;
    expect(telemetry.hasAppTarget(config)).toBe(false);
  });

  it('Result is correct when outputTargets contains www with serviceWorker', () => {
    const config = { outputTargets: [{ type: WWW, serviceWorker: { swDest: './tmp' } }] } as d.Config;
    expect(telemetry.hasAppTarget(config)).toBe(true);
  });

  it('Result is correct when outputTargets contains www with baseUrl', () => {
    const config = { outputTargets: [{ type: WWW, baseUrl: 'https://example.com' }] } as d.Config;
    expect(telemetry.hasAppTarget(config)).toBe(true);
  });

  it('Result is correct when outputTargets contains www with serviceWorker and baseUrl', () => {
    const config = {
      outputTargets: [{ type: WWW, baseUrl: 'https://example.com', serviceWorker: { swDest: './tmp' } }],
    } as d.Config;
    expect(telemetry.hasAppTarget(config)).toBe(true);
  });
});

describe('prepareData', () => {
  const config = {
    flags: {
      args: [],
    },
    outputTargets: [],
  } as d.Config;
  const sys = createSystem();

  it('provides an object', async () => {
    const data = await telemetry.prepareData(coreCompiler, config, sys, 1000);
    expect(data).toEqual({
      arguments: [],
      build: coreCompiler.buildId,
      component_count: undefined,
      config: {
        flags: {
          args: [],
        },
        outputTargets: [],
      },
      cpu_model: '',
      duration_ms: 1000,
      has_app_pwa_config: false,
      os_name: '',
      os_version: '',
      packages: [],
      packages_no_versions: [],
      rollup: coreCompiler.versions.rollup,
      stencil: coreCompiler.versions.stencil,
      system: 'in-memory __VERSION:STENCIL__',
      system_major: 'in-memory __VERSION:STENCIL__',
      targets: [],
      task: undefined,
      typescript: coreCompiler.versions.typescript,
      yarn: false,
    });
  });

  it('updates when there is a PWA config', async () => {
    const config = {
      flags: {
        args: [],
      },
      outputTargets: [{ type: 'www', baseUrl: 'https://example.com', serviceWorker: { swDest: './tmp' } }],
    } as d.Config;

    const data = await telemetry.prepareData(coreCompiler, config, sys, 1000);

    expect(data).toEqual({
      arguments: [],
      build: coreCompiler.buildId,
      component_count: undefined,
      config: {
        flags: {
          args: [],
        },
        outputTargets: [
          {
            baseUrl: 'omitted',
            serviceWorker: {
              swDest: 'omitted',
            },
            type: 'www',
          },
        ],
      },
      cpu_model: '',
      duration_ms: 1000,
      has_app_pwa_config: true,
      os_name: '',
      os_version: '',
      packages: [],
      packages_no_versions: [],
      rollup: coreCompiler.versions.rollup,
      stencil: coreCompiler.versions.stencil,
      system: 'in-memory __VERSION:STENCIL__',
      system_major: 'in-memory __VERSION:STENCIL__',
      targets: ['www'],
      task: undefined,
      typescript: coreCompiler.versions.typescript,
      yarn: false,
    });
  });

  it('updates when there is a component count passed in', async () => {
    const config = {
      flags: {
        args: [],
      },
      outputTargets: [{ type: 'www', baseUrl: 'https://example.com', serviceWorker: { swDest: './tmp' } }],
    } as d.Config;

    const data = await telemetry.prepareData(coreCompiler, config, sys, 1000, 12);

    expect(data).toEqual({
      arguments: [],
      build: coreCompiler.buildId,
      component_count: 12,
      config: {
        flags: {
          args: [],
        },
        outputTargets: [
          {
            baseUrl: 'omitted',
            serviceWorker: {
              swDest: 'omitted',
            },
            type: WWW,
          },
        ],
      },
      cpu_model: '',
      duration_ms: 1000,
      has_app_pwa_config: true,
      os_name: '',
      os_version: '',
      packages: [],
      packages_no_versions: [],
      rollup: coreCompiler.versions.rollup,
      stencil: coreCompiler.versions.stencil,
      system: 'in-memory __VERSION:STENCIL__',
      system_major: 'in-memory __VERSION:STENCIL__',
      targets: ['www'],
      task: undefined,
      typescript: coreCompiler.versions.typescript,
      yarn: false,
    });
  });
});

describe('anonymizeConfigForTelemetry', () => {
  it.each([
    'rootDir',
    'fsNamespace',
    'packageJsonFilePath',
    'namespace',
    'srcDir',
    'srcIndexHtml',
    'buildLogFilePath',
    'cacheDir',
    'configPath',
    'tsconfig',
  ])("should anonymize top-level string prop '%s'", (prop: string) => {
    const anonymizedConfig = anonymizeConfigForTelemetry({ [prop]: "shouldn't see this!", outputTargets: [] });
    expect(anonymizedConfig).toEqual({ [prop]: 'omitted', outputTargets: [] });
  });

  it.each(['sys', 'logger', 'devServer', 'tsCompilerOptions'])(
    "should remove objects under prop '%s'",
    (prop: string) => {
      const anonymizedConfig = anonymizeConfigForTelemetry({ [prop]: {}, outputTargets: [] });
      expect(anonymizedConfig).toEqual({
        outputTargets: [],
      });
    }
  );

  it('should retain outputTarget props on the keep list', () => {
    const anonymizedConfig = anonymizeConfigForTelemetry({
      outputTargets: [
        { type: WWW, baseUrl: 'https://example.com' },
        { type: DIST_HYDRATE_SCRIPT, external: ['beep', 'boop'], dir: 'shoud/go/away' },
        { type: DIST_CUSTOM_ELEMENTS, autoDefineCustomElements: false },
        { type: DIST_CUSTOM_ELEMENTS, generateTypeDeclarations: true },
        { type: DIST, typesDir: 'my-types' },
      ],
    });

    expect(anonymizedConfig).toEqual({
      outputTargets: [
        { type: WWW, baseUrl: 'omitted' },
        { type: DIST_HYDRATE_SCRIPT, external: ['beep', 'boop'], dir: 'omitted' },
        { type: DIST_CUSTOM_ELEMENTS, autoDefineCustomElements: false },
        { type: DIST_CUSTOM_ELEMENTS, generateTypeDeclarations: true },
        { type: DIST, typesDir: 'omitted' },
      ],
    });
  });
});
