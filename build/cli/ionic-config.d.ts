import type * as d from '../declarations';
export declare const isTest: () => boolean;
export declare const defaultConfig: (sys: d.CompilerSystem) => string;
export declare const defaultConfigDirectory: (sys: d.CompilerSystem) => string;
/**
 * Reads an Ionic configuration file from disk, parses it, and performs any necessary corrections to it if certain
 * values are deemed to be malformed
 * @param sys The system where the command is invoked
 * @returns the config read from disk that has been potentially been updated
 */
export declare function readConfig(sys: d.CompilerSystem): Promise<d.TelemetryConfig>;
/**
 * Writes an Ionic configuration file to disk.
 * @param sys The system where the command is invoked
 * @param config The config passed into the Stencil command
 * @returns boolean If the command was successful
 */
export declare function writeConfig(sys: d.CompilerSystem, config: d.TelemetryConfig): Promise<boolean>;
/**
 * Update a subset of the Ionic config.
 * @param sys The system where the command is invoked
 * @param newOptions The new options to save
 * @returns boolean If the command was successful
 */
export declare function updateConfig(sys: d.CompilerSystem, newOptions: d.TelemetryConfig): Promise<boolean>;
