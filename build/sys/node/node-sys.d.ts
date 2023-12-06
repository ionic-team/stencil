import type { CompilerSystem, Logger } from '../../declarations';
/**
 * Create a node.js-specific {@link CompilerSystem} to be used when Stencil is
 * run from the CLI or via the public API in a node context.
 *
 * This takes an optional param supplying a `process` object to be used.
 *
 * @param c an optional object wrapping `process` and `logger` objects
 * @returns a node.js `CompilerSystem` object
 */
export declare function createNodeSys(c?: {
    process?: any;
    logger?: Logger;
}): CompilerSystem;
