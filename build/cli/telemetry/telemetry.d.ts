import type * as d from '../../declarations';
import { CoreCompiler } from '../load-compiler';
/**
 * Used to within taskBuild to provide the component_count property.
 *
 * @param sys The system where the command is invoked
 * @param config The config passed into the Stencil command
 * @param coreCompiler The compiler used to do builds
 * @param result The results of a compiler build.
 */
export declare function telemetryBuildFinishedAction(sys: d.CompilerSystem, config: d.ValidatedConfig, coreCompiler: CoreCompiler, result: d.CompilerBuildResults): Promise<void>;
/**
 * A function to wrap a compiler task function around. Will send telemetry if, and only if, the machine allows.
 *
 * @param sys The system where the command is invoked
 * @param config The config passed into the Stencil command
 * @param coreCompiler The compiler used to do builds
 * @param action A Promise-based function to call in order to get the duration of any given command.
 * @returns void
 */
export declare function telemetryAction(sys: d.CompilerSystem, config: d.ValidatedConfig, coreCompiler: CoreCompiler, action?: d.TelemetryCallback): Promise<void>;
/**
 * Helper function to determine if a Stencil configuration builds an application.
 *
 * This function is a rough approximation whether an application is generated as a part of a Stencil build, based on
 * contents of the project's `stencil.config.ts` file.
 *
 * @param config the configuration used by the Stencil project
 * @returns true if we believe the project generates an application, false otherwise
 */
export declare function hasAppTarget(config: d.ValidatedConfig): boolean;
export declare function isUsingYarn(sys: d.CompilerSystem): boolean;
/**
 * Build a list of the different types of output targets used in a Stencil configuration.
 *
 * Duplicate entries will not be returned from the list
 *
 * @param config the configuration used by the Stencil project
 * @returns a unique list of output target types found in the Stencil configuration
 */
export declare function getActiveTargets(config: d.ValidatedConfig): string[];
/**
 * Prepare data for telemetry
 *
 * @param coreCompiler the core compiler
 * @param config the current Stencil config
 * @param sys the compiler system instance in use
 * @param duration_ms the duration of the action being tracked
 * @param component_count the number of components being built (optional)
 * @returns a Promise wrapping data for the telemetry endpoint
 */
export declare const prepareData: (coreCompiler: CoreCompiler, config: d.ValidatedConfig, sys: d.CompilerSystem, duration_ms: number | undefined, component_count?: number | undefined) => Promise<d.TrackableData>;
/**
 * Anonymize the config for telemetry, replacing potentially revealing config props
 * with a placeholder string if they are present (this lets us still track how frequently
 * these config options are being used)
 *
 * @param config the config to anonymize
 * @returns an anonymized copy of the same config
 */
export declare const anonymizeConfigForTelemetry: (config: d.ValidatedConfig) => d.Config;
/**
 * If telemetry is enabled, send a metric to an external data store
 *
 * @param sys the system instance where telemetry is invoked
 * @param config the Stencil configuration associated with the current task that triggered telemetry
 * @param name the name of a trackable metric. Note this name is not necessarily a scalar value to track, like
 * "Stencil Version". For example, "stencil_cli_command" is a name that is used to track all CLI command information.
 * @param value the data to send to the external data store under the provided name argument
 */
export declare function sendMetric(sys: d.CompilerSystem, config: d.ValidatedConfig, name: string, value: d.TrackableData): Promise<void>;
/**
 * Checks if telemetry is enabled on this machine
 * @param sys The system where the command is invoked
 * @returns true if telemetry is enabled, false otherwise
 */
export declare function checkTelemetry(sys: d.CompilerSystem): Promise<boolean>;
/**
 * Writes to the config file, enabling telemetry for this machine.
 * @param sys The system where the command is invoked
 * @returns true if writing the file was successful, false otherwise
 */
export declare function enableTelemetry(sys: d.CompilerSystem): Promise<boolean>;
/**
 * Writes to the config file, disabling telemetry for this machine.
 * @param sys The system where the command is invoked
 * @returns true if writing the file was successful, false otherwise
 */
export declare function disableTelemetry(sys: d.CompilerSystem): Promise<boolean>;
