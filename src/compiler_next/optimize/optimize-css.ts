import * as d from '../../declarations';
import { autoprefixCss } from './autoprefixer';
import { hasError } from '@utils';
import { minifyCss } from './minify-css';

export const optimizeCss = async (inputOpts: d.OptimizeCssInput) => {
  let result: d.OptimizeCssOutput = {
    css: inputOpts.css,
    diagnostics: []
  };
  if (inputOpts.autoprefixer !== false) {
    result = await autoprefixCss(inputOpts.css, inputOpts.autoprefixer);
    if (hasError(result.diagnostics)) {
      return result;
    }
  }
  if (inputOpts.minify) {
    result.css = minifyCss(result.css);
  }
  return result;
};
