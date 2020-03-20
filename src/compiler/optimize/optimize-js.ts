import { Config, OptimizeJsInput, OptimizeJsOutput } from '../../declarations';
import { catchError } from '@utils';
import { getTerserOptions } from './optimize-module';
import { minifyJs } from './minify-js';

export const optimizeJs = async (inputOpts: OptimizeJsInput) => {
  const result: OptimizeJsOutput = {
    output: inputOpts.input,
    diagnostics: [],
    sourceMap: null,
  };

  try {
    const prettyOutput = !!inputOpts.pretty;
    const config: Config = {
      extras: {
        safari10: true,
      },
    };
    const sourceTarget = inputOpts.target === 'es5' ? 'es5' : 'latest';
    const minifyOpts = getTerserOptions(config, sourceTarget, prettyOutput);

    const minifyResults = await minifyJs(inputOpts.input, minifyOpts);
    if (minifyResults.diagnostics.length > 0) {
      result.diagnostics.push(...minifyResults.diagnostics);
    } else {
      result.output = minifyResults.output;
      result.sourceMap = minifyResults.sourceMap;
    }
  } catch (e) {
    catchError(result.diagnostics, e);
  }

  return result;
};
