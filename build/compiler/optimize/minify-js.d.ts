import { MinifyOptions } from 'terser';
import type * as d from '../../declarations';
/**
 * Performs the minification of JavaScript source
 * @param input the JavaScript source to minify
 * @param opts the options used by the minifier
 * @returns the resulting minified JavaScript
 */
export declare const minifyJs: (input: string, opts?: MinifyOptions) => Promise<d.OptimizeJsResult>;
