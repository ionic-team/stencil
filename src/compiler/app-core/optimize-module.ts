import * as d from '../../declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';


export async function optimizeModule(config: d.Config, compilerCtx: d.CompilerCtx, sourceTarget: d.SourceTarget, isCore: boolean, input: string) {
  const isDebug = (config.logLevel === 'debug');

  const opts = getTerserOptions(sourceTarget, isDebug);

  if (sourceTarget !== 'es5' && isCore) {
    if (!isDebug) {
      opts.compress.passes = 3;
      opts.compress.global_defs = {
        supportsListenerOptions: true,
        'plt.$cssShim$': false
      };
      opts.compress.pure_funcs = opts.compress.pure_funcs || [];
      opts.compress.pure_funcs = ['getHostRef', ...opts.compress.pure_funcs];
    }

    opts.mangle.properties = {
      regex: '^\\$.+\\$$',
      debug: isDebug
    };
  }

  let cacheKey: string;
  if (compilerCtx) {
    cacheKey = await compilerCtx.cache.createKey('minifyModule', COMPILER_BUILD.id, opts, input);
    const cachedContent = await compilerCtx.cache.get(cacheKey);
    if (cachedContent != null) {
      return {
        output: cachedContent,
        diagnostics: [] as d.Diagnostic[]
      };
    }
  }

  const results = await config.sys.minifyJs(input, opts);
  if (results != null && typeof results.output === 'string' && results.diagnostics.length === 0 && compilerCtx != null) {
    if (isCore) {
      results.output = results.output
        .replace(/disconnectedCallback\(\)\{\},/g, '');
    }
    await compilerCtx.cache.put(cacheKey, results.output);
  }

  return results;
}


export const getTerserOptions = (sourceTarget: d.SourceTarget, isDebug: boolean) => {
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
    };

    opts.ecma = opts.output.ecma = opts.compress.ecma = 7;
    opts.toplevel = true;
    opts.module = true;
    opts.compress.toplevel = true;
    opts.mangle.toplevel = true;
    opts.compress.arrows = true;
    opts.compress.module = true;
  }

  if (isDebug) {
    opts.mangle = { keep_fnames: true };
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
