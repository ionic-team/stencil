import * as d from '@declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { RESERVED_PROPERTIES } from './reserved-properties';
import { sys } from '@sys';


export async function optimizeAppCoreBundle(compilerCtx: d.CompilerCtx, build: d.Build, input: string) {
  const opts = JSON.parse(PROD_MINIFY_OPTS);

  if (build.es5) {
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

  if (build.isDebug) {
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

  } else {
    opts.output.comments = '/webpack/';
  }

  let cacheKey: string;
  if (compilerCtx) {
    cacheKey = compilerCtx.cache.createKey('minifyCore', COMPILER_BUILD.id, opts, input);
    const cachedContent = await compilerCtx.cache.get(cacheKey);
    if (cachedContent != null) {
      return {
        output: cachedContent,
        diagnostics: [] as d.Diagnostic[]
      };
    }
  }

  const results = await sys.minifyJs(input, opts);
  if (results != null && typeof results.output === 'string' && results.diagnostics.length === 0 && compilerCtx != null) {

    if (!build.lazyLoad) {
      results.output = results.output.replace(/export(.*);/, '');

      results.output = results.output.replace(/disconnectedCallback\(\){}/g, '');
    }

    await compilerCtx.cache.put(cacheKey, results.output);
  }

  return results;
}


export const PROD_MINIFY_OPTS = JSON.stringify({
  compress: {
    arguments: true,
    arrows: false,
    booleans: true,
    collapse_vars: true,
    comparisons: true,
    conditionals: true,
    dead_code: true,
    drop_console: false,
    drop_debugger: true,
    evaluate: true,
    expression: true,
    hoist_funs: true,
    hoist_vars: true,
    ie8: false,
    if_return: true,
    inline: true,
    join_vars: true,
    keep_fargs: false,
    keep_fnames: false,
    keep_infinity: true,
    loops: true,
    negate_iife: false,
    passes: 4,
    properties: true,
    pure_funcs: ['getHostRef'],
    pure_getters: true,
    reduce_funcs: true,
    reduce_vars: true,
    sequences: true,
    side_effects: true,
    switches: true,
    typeofs: true,
    toplevel: false,
    top_retain: false,
    unsafe: true,
    unused: true,
    warnings: false
  },
  mangle: {
    properties: {
      builtins: false,
      debug: false,
      keep_quoted: true,
      reserved: RESERVED_PROPERTIES
    },
    toplevel: true,
  },
  output: {
    ascii_only: false,
    beautify: false,
    comments: false,
    ie8: false,
    indent_level: 0,
    indent_start: 0,
    inline_script: false,
    keep_quoted_props: false,
    max_line_len: false,
    preamble: null,
    quote_keys: false,
    quote_style: 0,
    semicolons: true,
    shebang: true,
    source_map: null,
    webkit: false,
    width: 80,
    wrap_iife: false
  }
});
