import { OptimizeCssInput, OptimizeCssOutput } from '../../declarations';
/**
 * Optimize a CSS file, optionally running an autoprefixer and a minifier
 * depending on the options set on the input options argument.
 *
 * @param inputOpts input CSS options
 * @returns a promise wrapping the optimized output
 */
export declare const optimizeCss: (inputOpts: OptimizeCssInput) => Promise<OptimizeCssOutput>;
