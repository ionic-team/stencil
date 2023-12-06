import type { CompilerSystem, Logger } from '../declarations';
import type { CoreCompiler } from './load-compiler';
/**
 * Generate the output for Stencils 'info' task, and log that output - `npx stencil info`
 * @param coreCompiler the compiler instance to derive certain version information from
 * @param sys the compiler system instance that provides details about the system Stencil is running on
 * @param logger the logger instance to use to log information out to
 */
export declare const taskInfo: (coreCompiler: CoreCompiler, sys: CompilerSystem, logger: Logger) => void;
