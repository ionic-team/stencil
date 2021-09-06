import { isInteractive } from './helpers';
import { checkTelemetry } from './telemetry';

/**
 * Used to determine if tracking should occur.
 * @param ci whether or not the process is running in a Continuous Integration (CI) environment
 * @returns true if telemetry should be sent, false otherwise
 */
export async function shouldTrack(ci?: boolean) {
  return !ci && isInteractive() && (await checkTelemetry());
}
