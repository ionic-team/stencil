import { OptimizeCssInput, OptimizeCssOutput } from '../../declarations';
import { autoprefixCss } from './autoprefixer';
import { hasError } from '@utils';
import { minifyCss } from './minify-css';

export const optimizeCss = async (inputOpts: OptimizeCssInput) => {
  let result: OptimizeCssOutput = {
    output: inputOpts.input,
    diagnostics: [],
  };
  if (inputOpts.autoprefixer !== false && inputOpts.autoprefixer !== null) {
    result = await autoprefixCss(inputOpts.input, inputOpts.autoprefixer);
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
