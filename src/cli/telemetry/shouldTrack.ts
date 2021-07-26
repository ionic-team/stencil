import { isInteractive } from './helpers';
import { checkTelemetry } from './telemetry';

/**
 * Used to determine if tracking should occur.
 * @param ci boolean
 * @returns boolean
 */
export async function shouldTrack(ci?: boolean) {
  return !ci && isInteractive() && (await checkTelemetry());
}
