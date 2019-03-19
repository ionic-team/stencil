import * as d from '../../declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';


export async function optimizeModule(config: d.Config, compilerCtx: d.CompilerCtx, sourceTarget: d.SourceTarget, webpackBuild: boolean, input: string) {
  const opts: any = {
    output: {},
    compress: {
      pure_getters: true,
      keep_fargs: false,
      passes: 4,
      pure_funcs: ['getHostRef'],
      global_defs: {
        'STENCIL_SOURCE_TARGET': sourceTarget,
        'STENCIL_PATCH_IMPORT': !webpackBuild
      }
    },
    mangle: {
      properties: {
        regex: '^\\$.+\\$$',
      },
      toplevel: true,
    }
  };

  if (sourceTarget === 'es5') {
    opts.ecma = 5;
    opts.output.ecma = 5;
    opts.compress.ecma = 5;
    opts.compress.arrows = false;
    opts.compress.module = false;

  } else {
    opts.ecma = 7;
    opts.module = true;
    opts.output.ecma = 7;
    opts.compress.ecma = 7;
    opts.compress.toplevel = true;
    opts.compress.arrows = true;
    opts.compress.module = true;
  }
  if (webpackBuild) {
    opts.output.comments = '/webpack/';
  }

  if (config.logLevel === 'debug') {
    // if in debug mode, still mangle the property names
    // but at least make them readable of what the
    // properties originally were named
    opts.mangle.properties.debug = true;
    opts.mangle.keep_fnames = true;
    opts.compress.drop_console = false;
    opts.compress.drop_debugger = false;
    opts.output.beautify = true;
    opts.output.indent_level = 2;
    opts.output.comments = 'all';
  }

  let cacheKey: string;
  if (compilerCtx) {
    cacheKey = compilerCtx.cache.createKey('minifyModule', COMPILER_BUILD.id, opts, input);
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
    await compilerCtx.cache.put(cacheKey, results.output);
  }

  return results;
}
