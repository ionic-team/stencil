import type * as d from '../../declarations';
/**
 * Autoprefix a CSS string, adding vendor prefixes to make sure that what
 * is written in the CSS will render correctly in our range of supported browsers.
 * This function uses PostCSS in combination with the Autoprefix plugin to
 * automatically add vendor prefixes based on a list of browsers which we want
 * to support.
 *
 * @param cssText the text to be prefixed
 * @param opts an optional param with options for Autoprefixer
 * @returns a Promise wrapping some prefixed CSS as well as diagnostics
 */
export declare const autoprefixCss: (cssText: string, opts: boolean | null | d.AutoprefixerOptions) => Promise<d.OptimizeCssOutput>;
