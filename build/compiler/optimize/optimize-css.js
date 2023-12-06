import { hasError } from '@utils';
import { autoprefixCss } from './autoprefixer';
import { minifyCss } from './minify-css';
/**
 * Optimize a CSS file, optionally running an autoprefixer and a minifier
 * depending on the options set on the input options argument.
 *
 * @param inputOpts input CSS options
 * @returns a promise wrapping the optimized output
 */
export const optimizeCss = async (inputOpts) => {
    var _a;
    let result = {
        output: inputOpts.input,
        diagnostics: [],
    };
    if (inputOpts.autoprefixer !== false && inputOpts.autoprefixer !== null) {
        result = await autoprefixCss(inputOpts.input, (_a = inputOpts.autoprefixer) !== null && _a !== void 0 ? _a : null);
        if (hasError(result.diagnostics)) {
            return result;
        }
    }
    if (inputOpts.minify !== false) {
        result.output = await minifyCss({
            css: result.output,
            resolveUrl: inputOpts.resolveUrl,
        });
    }
    return result;
};
//# sourceMappingURL=optimize-css.js.map