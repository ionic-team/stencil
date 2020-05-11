import { CompilerSystem, Config, ConfigFlags, Logger, TaskCommand } from '@stencil/core/internal';

/**
 * Creates a "logger", based off of NodeJS APIs, that will be used by the compiler and dev-server.
 * By default the CLI uses this method to create the NodeJS logger. The NodeJS "process"
 * object should be provided as the first argument.
 */
export declare function createNodeLogger(process: any): Logger;

/**
 * Creates the "system", based off of NodeJS APIs, used by the compiler. This includes any and
 * all file system reads and writes using NodeJS. The compiler itself is unaware of Node's
 * `fs` module. Other system APIs include any use of `crypto` to hash content. The NodeJS "process"
 * object should be provided as the first argument.
 */
export declare function createNodeSystem(process: any): CompilerSystem;

/**
 * Used by the CLI to parse command-line arguments into a typed `ConfigFlags` object.
 * This is an example of how it's used internally: `parseFlags(process.argv.slice(2))`.
 */
export declare function parseFlags(args: string[]): ConfigFlags;

/**
 * Runs the CLI with the given options. This is used by Stencil's default `bin/stencil` file,
 * but can be used externally too.
 */
export declare function run(init: CliInitOptions): Promise<void>;
export interface CliInitOptions {
  /**
   * NodeJS `process`.
   * https://nodejs.org/api/process.html
   */
  process?: any;
  /**
   * Stencil Logger.
   */
  logger?: Logger;
  /**
   * Stencil System.
   */
  sys?: CompilerSystem;
}

/**
 * Runs individual tasks giving a NodeJS `process`, Stencil `config`, and task command.
 */
export declare function runTask(process: any, config: Config, task: TaskCommand): Promise<void>;
export { CompilerSystem, Config, ConfigFlags, Logger, TaskCommand };
