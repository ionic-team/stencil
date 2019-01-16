import * as d from '../../declarations';
import { catchError } from '@stencil/core/utils';
import cssnano, { CssNanoOptions } from 'cssnano';
import autoprefixer, { Options } from 'autoprefixer';
import postcss, { AcceptedPlugin } from 'postcss';


export async function optimizeCssWorker(inputOpts: d.OptimizeCssInput) {
  const output: d.OptimizeCssOutput = {
    css: null,
    diagnostics: []
  };

  try {
    const plugins: AcceptedPlugin[] = [];

    if (inputOpts.autoprefixer !== false && inputOpts.autoprefixer !== null) {
      plugins.push(addAutoprefixer(inputOpts));
    }

    if (inputOpts.minify) {
      plugins.push(addMinify());
    }

    const processor = postcss(plugins);

    const result = await processor.process(inputOpts.css, {
      map: null,
      from: inputOpts.filePath
    });

    result.warnings().forEach(warning => {
      output.diagnostics.push({
        header: `Optimize CSS: ${warning.plugin}`,
        messageText: warning.text,
        level: 'warn',
        type: 'css'
      });
    });

    output.css = result.css;

  } catch (e) {
    catchError(output.diagnostics, e);
  }

  return output;
}


export function addAutoprefixer(inputOpts: d.OptimizeCssInput) {
  const autoprefixerOpts = (inputOpts.autoprefixer != null && typeof inputOpts.autoprefixer === 'object') ? inputOpts.autoprefixer : DEFAULT_AUTOPREFIX_LEGACY;

  return autoprefixer(autoprefixerOpts);
}


const DEFAULT_AUTOPREFIX_LEGACY: Options = {
  browsers: [
    'last 2 versions',
    'iOS >= 9',
    'Android >= 4.4',
    'Explorer >= 11',
    'ExplorerMobile >= 11'
  ],
  cascade: false,
  remove: false,
  flexbox: 'no-2009'
};


export function addMinify() {
  const cssnanoOpts: CssNanoOptions = {
    preset: 'default'
  };

  return cssnano(cssnanoOpts);
}
