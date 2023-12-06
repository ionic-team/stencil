import type { Compiler, Config } from '../declarations';
/**
 * Generate a Stencil compiler instance
 * @param userConfig a user-provided Stencil configuration to apply to the compiler instance
 * @returns a new instance of a Stencil compiler
 * @public
 */
export declare const createCompiler: (userConfig: Config) => Promise<Compiler>;
