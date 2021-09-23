import * as d from '../../declarations';
import { isInteractive } from './helpers';
import { checkTelemetry } from './telemetry';

/**
 * Used to determine if tracking should occur.
 * @param ci whether or not the process is running in a Continuous Integration (CI) environment
 * @returns true if telemetry should be sent, false otherwise
 */
export async function shouldTrack(config: d.Config, sys: d.CompilerSystem, ci?: boolean) {
  return !ci && isInteractive(sys, config) && (await checkTelemetry(sys));
}
