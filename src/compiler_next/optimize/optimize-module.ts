import { CompilerCtx, Config, Diagnostic, SourceTarget } from '../../declarations';
import { minfyJsId } from '../../version';
import { transpileToEs5 } from '../transpile/transpile-to-es5';
import { minifyJs } from './minify-js';
import { DEFAULT_STYLE_MODE } from '@utils';

interface OptimizeModuleOptions {
  input: string;
  sourceTarget?: SourceTarget;
  isCore?: boolean;
  minify?: boolean;
  inlineHelpers?: boolean;
  modeName?: string;
}

export async function optimizeModule(
  config: Config,
  compilerCtx: CompilerCtx,
  opts: OptimizeModuleOptions
) {
  if (!opts.minify && opts.sourceTarget !== 'es5') {
    return {
      output: opts.input,
      diagnostics: [] as Diagnostic[]
    };
  }
  const isDebug = (config.logLevel === 'debug');
  const cacheKey = await compilerCtx.cache.createKey('optimizeModule', minfyJsId, opts, isDebug);
  const cachedContent = await compilerCtx.cache.get(cacheKey);
  if (cachedContent != null) {
    return {
      output: cachedContent,
      diagnostics: [] as Diagnostic[]
    };
  }

  let minifyOpts: any;
  if (opts.minify) {
    minifyOpts = getTerserOptions(opts.sourceTarget, isDebug);
    if (opts.sourceTarget !== 'es5' && opts.isCore) {
      if (!isDebug) {
        minifyOpts.compress.passes = 3;
        minifyOpts.compress.global_defs = {
          supportsListenerOptions: true,
          'plt.$cssShim$': false
        };
        minifyOpts.compress.pure_funcs = ['getHostRef', ...minifyOpts.compress.pure_funcs];
      }

      minifyOpts.mangle.properties = {
        regex: '^\\$.+\\$$',
        debug: isDebug
      };
    }
    if (opts.modeName && opts.modeName !== DEFAULT_STYLE_MODE) {
      const regex = new RegExp(`\\/\\*STENCIL:MODE:((?!${opts.modeName}).)*\\*\\/.*$`, 'gm');
      opts.input = opts.input.replace(regex, '');
    }
  }

  const shouldTranspile = opts.sourceTarget === 'es5';
  const results = await compilerCtx.worker.prepareModule(opts.input, minifyOpts, shouldTranspile, opts.inlineHelpers);
  if (results != null && typeof results.output === 'string' && results.diagnostics.length === 0 && compilerCtx != null) {
    if (opts.isCore) {
      results.output = results.output
        .replace(/disconnectedCallback\(\)\{\}/g, '');
    }
    await compilerCtx.cache.put(cacheKey, results.output);
  }
  return results;
}


export const getTerserOptions = (sourceTarget: SourceTarget, isDebug: boolean) => {
  const opts: any = {
    safari10: true,
    output: {},
  };

  if (sourceTarget === 'es5') {
    opts.ecma = opts.output.ecma = 5;
    opts.compress = false;
    opts.mangle = true;

  } else {
    opts.mangle = {
      properties: {
        regex: '^\\$.+\\$$'
      }
    };
    opts.compress = {
      pure_getters: true,
      keep_fargs: false,
      passes: 2,
      pure_funcs: [
        'console.debug'
      ]
    };

    opts.ecma = opts.output.ecma = opts.compress.ecma = 8;
    opts.toplevel = true;
    opts.module = true;
    opts.compress.toplevel = true;
    opts.mangle.toplevel = true;
    opts.compress.arrows = true;
    opts.compress.module = true;
  }

  if (isDebug) {
    opts.mangle = {keep_fnames: true};
    opts.compress = {};
    opts.compress.drop_console = false;
    opts.compress.drop_debugger = false;
    opts.compress.pure_funcs = [];
    opts.output.beautify = true;
    opts.output.indent_level = 2;
    opts.output.comments = 'all';
  }

  return opts;
};


export const prepareModule = async (
  input: string,
  minifyOpts: any,
  transpile: boolean,
  inlineHelpers: boolean
) => {
  if (transpile) {
    const transpile = await transpileToEs5(input, inlineHelpers);
    if (transpile.diagnostics.length > 0) {
      return {
        sourceMap: null,
        output: null,
        diagnostics: transpile.diagnostics
      };
    }
    input = transpile.code;
  }
  if (minifyOpts) {
    return minifyJs(input, minifyOpts);
  }
  return {
    output: input,
    diagnostics: [] as Diagnostic[],
    sourceMap: null,
  };
};
