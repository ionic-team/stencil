import * as d from '../../declarations';
/**
 * Used to determine if tracking should occur.
 * @param config The config passed into the Stencil command
 * @param sys The system where the command is invoked
 * @param ci whether or not the process is running in a Continuous Integration (CI) environment
 * @returns true if telemetry should be sent, false otherwise
 */
export declare function shouldTrack(config: d.ValidatedConfig, sys: d.CompilerSystem, ci?: boolean): Promise<boolean>;
