import type * as d from '@stencil/core/internal';
/**
 * Reset build conditionals used for testing to a known "good state".
 *
 * This function does not return a value, but rather mutates its argument in place.
 * Certain values are set to `true` or `false` for testing purpose (see this function's implementation for the full
 * list). Build conditional options _not_ in that list that are set to `true` when this function is invoked will remain
 * set to `true`.
 *
 * @param b the build conditionals to reset.
 */
export declare function resetBuildConditionals(b: d.BuildConditionals): void;
