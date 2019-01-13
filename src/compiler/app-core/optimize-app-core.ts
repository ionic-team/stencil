import * as d from '../../declarations';
import { RESERVED_PROPERTIES } from './reserved-properties';


export async function optimizeAppCoreBundle(config: d.Config, compilerCtx: d.CompilerCtx, build: d.Build, input: string) {
  const opts = JSON.parse(config.minifyJs ? PROD_MINIFY_OPTS : DEV_MINIFY_OPTS);
  opts.compress.global_defs = {};

  Object.keys(build).forEach(key => {
    let value = (build as any)[key];
    if (typeof value !== 'string') {
      value = !!value;
    }
    opts.compress.global_defs[`BUILD.${key}`] = value;
  });

  if (build.es5) {
    opts.ecma = 5;
    opts.output.ecma = 5;
    opts.compress.ecma = 5;
    opts.compress.arrows = false;
    opts.compress.module = false;

  } else {
    opts.ecma = 7;
    opts.output.ecma = 7;
    opts.compress.ecma = 7;
    opts.compress.module = true;
  }

  if (config.minifyJs) {
    if (!build.es5) {
      opts.compress.arrows = true;
    }

    // reserved properties is a list of properties to NOT rename
    // if something works in dev, but a runtime error in prod
    // chances are we need to add a property to this list
    opts.mangle.properties.reserved = RESERVED_PROPERTIES.slice();
    opts.mangle.properties.reserved.push(build.appNamespace);
    opts.mangle.properties.reserved.push(build.appNamespaceLower);

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

    } else {
      opts.output.comments = '/webpack/';
    }
  }

  let cacheKey: string;
  if (compilerCtx) {
    cacheKey = compilerCtx.cache.createKey('minifyCore', '__BUILDID__', opts, input);
    const cachedContent = await compilerCtx.cache.get(cacheKey);
    if (cachedContent != null) {
      return {
        output: cachedContent,
        diagnostics: [] as d.Diagnostic[]
      };
    }
  }

  const results = await config.sys.minifyJs(input, opts);
  if (results && results.diagnostics.length === 0 && compilerCtx) {

    if (!build.asyncLifecycle) {
      results.output = results.output.replace(/async/g, '')
                                     .replace(/await/g, '');
    }

    if (!build.lazyLoad) {
      results.output = results.output.replace(/export(.*);/, '');

      results.output = results.output.replace(/disconnectedCallback\(\){}/g, '');
    }

    await compilerCtx.cache.put(cacheKey, results.output);
  }

  return results;
}


// https://www.npmjs.com/package/terser
export const DEV_MINIFY_OPTS = JSON.stringify({
  compress: {
    arguments: false,
    arrows: false,
    booleans: false,
    booleans_as_integers: false,
    collapse_vars: false,
    comparisons: false,
    conditionals: true, // must set for dead_code removal
    dead_code: true,
    drop_console: false,
    drop_debugger: false,
    evaluate: true,
    expression: false,
    hoist_funs: false,
    hoist_vars: false,
    ie8: false,
    if_return: false,
    inline: false,
    join_vars: false,
    keep_fargs: false,
    keep_fnames: true,
    keep_infinity: true,
    loops: false,
    negate_iife: false,
    passes: 2,
    properties: true,
    pure_funcs: null,
    pure_getters: false,
    reduce_funcs: false,
    reduce_vars: true,
    sequences: true,
    side_effects: true,
    switches: false,
    toplevel: true,
    top_retain: false,
    typeofs: false,
    unsafe: false,
    unsafe_arrows: false,
    unsafe_comps: false,
    unsafe_Function: false,
    unsafe_math: false,
    unsafe_proto: false,
    unsafe_regexp: false,
    unused: true,
    warnings: false
  },
  mangle: false,
  output: {
    ascii_only: false,
    beautify: true,
    comments: 'all',
    ie8: false,
    indent_level: 2,
    indent_start: 0,
    inline_script: true,
    keep_quoted_props: true,
    max_line_len: false,
    preamble: null,
    quote_keys: false,
    quote_style: 1,
    semicolons: true,
    shebang: true,
    source_map: null,
    webkit: false,
    width: 80,
    wrap_iife: false
  }
});


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
    passes: 3,
    properties: true,
    pure_funcs: null,
    pure_getters: false,
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
      keep_quoted: true
    },
    toplevel: true
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
