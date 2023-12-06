import type * as d from '../../declarations';
/**
 * Our main entry point to this module. This performs an async transformation
 * of CSS input to ESM.
 *
 * @param input CSS input to be transformed to ESM
 * @returns a promise wrapping transformed ESM output
 */
export declare const transformCssToEsm: (input: d.TransformCssToEsmInput) => Promise<d.TransformCssToEsmOutput>;
/**
 * A sync function for transforming input CSS to ESM
 *
 * @param input the input CSS we're going to transform
 * @returns transformed ESM output
 */
export declare const transformCssToEsmSync: (input: d.TransformCssToEsmInput) => d.TransformCssToEsmOutput;
