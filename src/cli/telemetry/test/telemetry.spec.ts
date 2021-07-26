import { initializeStencilCLIConfig } from '../../state/stencil-cli-config';
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
      new Promise(resolve => {
        resolve(true);
      }),
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
      new Promise(resolve => {
        resolve(true);
      }),
    );

    await telemetry.telemetryAction(() => {});
    expect(spyShouldTrack).toHaveBeenCalled();

    spyShouldTrack.mockRestore();
  });

  it('issues a network request when passed async function is complete', async () => {
    const spyShouldTrack = jest.spyOn(shouldTrack, 'shouldTrack');
    spyShouldTrack.mockReturnValue(
      new Promise(resolve => {
        resolve(true);
      }),
    );

    await telemetry.telemetryAction(async () => {
      new Promise(resolve => {
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
  it('will read from a file', async () => {
    await telemetry.enableTelemetry();
    expect(await telemetry.checkTelemetry()).toBe(true);
    await telemetry.disableTelemetry();
    expect(await telemetry.checkTelemetry()).toBe(false);
    await telemetry.enableTelemetry();
    expect(await telemetry.checkTelemetry()).toBe(true);
  });
});
