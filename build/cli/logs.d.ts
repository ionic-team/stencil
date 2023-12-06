import type { CompilerSystem, Logger, TaskCommand, ValidatedConfig } from '../declarations';
import type { ConfigFlags } from './config-flags';
import type { CoreCompiler } from './load-compiler';
/**
 * Log the name of this package (`@stencil/core`) to an output stream
 *
 * The output stream is determined by the {@link Logger} instance that is provided as an argument to this function
 *
 * The name of the package may not be logged, by design, for certain `task` types and logging levels
 *
 * @param logger the logging entity to use to output the name of the package
 * @param task the current task
 */
export declare const startupLog: (logger: Logger, task: TaskCommand) => void;
/**
 * Log this package's version to an output stream
 *
 * The output stream is determined by the {@link Logger} instance that is provided as an argument to this function
 *
 * The package version may not be logged, by design, for certain `task` types and logging levels
 *
 * @param logger the logging entity to use for output
 * @param task the current task
 * @param coreCompiler the compiler instance to derive version information from
 */
export declare const startupLogVersion: (logger: Logger, task: TaskCommand, coreCompiler: CoreCompiler) => void;
/**
 * Log details from a {@link CompilerSystem} used by Stencil to an output stream
 *
 * The output stream is determined by the {@link Logger} instance that is provided as an argument to this function
 *
 * @param sys the `CompilerSystem` to report details on
 * @param logger the logging entity to use for output
 * @param flags user set flags for the current invocation of Stencil
 * @param coreCompiler the compiler instance being used for this invocation of Stencil
 */
export declare const loadedCompilerLog: (sys: CompilerSystem, logger: Logger, flags: ConfigFlags, coreCompiler: CoreCompiler) => void;
/**
 * Log various warnings to an output stream
 *
 * The output stream is determined by the {@link Logger} instance attached to the `config` argument to this function
 *
 * @param coreCompiler the compiler instance being used for this invocation of Stencil
 * @param config a validated configuration object to be used for this run of Stencil
 */
export declare const startupCompilerLog: (coreCompiler: CoreCompiler, config: ValidatedConfig) => void;
