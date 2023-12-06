import type { CompilerSystem, Logger } from '../../declarations';
/**
 * Create an in-memory `CompilerSystem` object, optionally using a supplied
 * logger instance
 *
 * This particular system being an 'in-memory' `CompilerSystem` is intended for
 * use in the browser. In most cases, for instance when using Stencil through
 * the CLI, a Node.js-specific `CompilerSystem` will be used instead. See
 * {@link CompilerSystem} for more details.
 *
 * @param c an object wrapping a logger instance
 * @returns a complete CompilerSystem, ready for use!
 */
export declare const createSystem: (c?: {
    logger?: Logger;
}) => CompilerSystem;
