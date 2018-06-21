import * as d from '../../declarations';
import { RESERVED_PROPERTIES } from './reserved-properties';
import { transpileCoreBuild } from '../transpile/core-build';


export async function buildCoreContent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, coreBuild: d.BuildConditionals, coreContent: string) {
  if (buildCtx.shouldAbort()) {
    return null;
  }

  const timespan = buildCtx.createTimeSpan(`buildCoreContent ${coreBuild.coreId} started`, true);

  const transpileResults = await transpileCoreBuild(config, compilerCtx, coreBuild, coreContent);

  if (transpileResults.diagnostics && transpileResults.diagnostics.length) {
    buildCtx.diagnostics.push(...transpileResults.diagnostics);
    return coreContent;
  }

  coreContent = transpileResults.code;

  const sourceTarget: d.SourceTarget = coreBuild.es5 ? 'es5' : 'es2017';

  const minifyResults = await minifyCore(config, compilerCtx, sourceTarget, coreContent);

  if (minifyResults.diagnostics && minifyResults.diagnostics.length) {
    buildCtx.diagnostics.push(...minifyResults.diagnostics);
    return coreContent;
  }

  timespan.finish(`buildCoreContent ${coreBuild.coreId} finished`);

  return minifyResults.output;
}


export async function minifyCore(config: d.Config, compilerCtx: d.CompilerCtx, sourceTarget: d.SourceTarget, input: string) {
  const opts: any = Object.assign({}, config.minifyJs ? PROD_MINIFY_OPTS : DEV_MINIFY_OPTS);

  if (sourceTarget === 'es5') {
    opts.ecma = 5;
    opts.output.ecma = 5;
    opts.compress.ecma = 5;
    opts.compress.arrows = false;
  }

  opts.compress.toplevel = true;

  if (config.minifyJs) {
    if (sourceTarget !== 'es5') {
      opts.compress.arrows = true;
    }

    // reserved properties is a list of properties to NOT rename
    // if something works in dev, but a runtime error in prod
    // chances are we need to add a property to this list
    opts.mangle.properties.reserved = RESERVED_PROPERTIES.slice();

    if (config.logLevel === 'debug') {
      // if in debug mode, still mangle the property names
      // but at least make them readable of what the
      // properties originally were named
      opts.mangle.properties.debug = true;
      opts.mangle.keep_fnames = true;
      opts.compress.drop_console = false;
      opts.compress.drop_debugger = false;
      opts.output.beautify = true;
      opts.output.bracketize = true;
      opts.output.indent_level = 2;
      opts.output.comments = 'all';
      opts.output.preserve_line = true;
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
    await compilerCtx.cache.put(cacheKey, results.output);
  }

  return results;
}


// Documentation of uglify options: https://github.com/mishoo/UglifyJS2
const DEV_MINIFY_OPTS: any = {
  compress: {
    arrows: false,
    booleans: false,
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
    keep_fargs: true,
    keep_fnames: true,
    keep_infinity: true,
    loops: false,
    negate_iife: false,
    passes: 1,
    properties: true,
    pure_funcs: null,
    pure_getters: false,
    reduce_vars: false,
    sequences: false,
    side_effects: false,
    switches: false,
    typeofs: false,
    top_retain: false,
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
    bracketize: true,
    comments: 'all',
    ie8: false,
    indent_level: 2,
    indent_start: 0,
    inline_script: true,
    keep_quoted_props: true,
    max_line_len: false,
    preamble: null,
    preserve_line: true,
    quote_keys: false,
    quote_style: 1,
    semicolons: true,
    shebang: true,
    source_map: null,
    webkit: false,
    width: 80,
    wrap_iife: false
  }
};


const PROD_MINIFY_OPTS: any = {
  compress: {
    arrows: false,
    booleans: true,
    collapse_vars: true,
    comparisons: true,
    conditionals: true,
    dead_code: true,
    drop_console: true,
    drop_debugger: true,
    evaluate: true,
    expression: true,
    hoist_funs: true,
    hoist_vars: false,
    ie8: false,
    if_return: true,
    inline: true,
    join_vars: true,
    keep_fargs: true,
    keep_fnames: true,
    keep_infinity: true,
    loops: true,
    negate_iife: false,
    passes: 2,
    properties: true,
    pure_funcs: null,
    pure_getters: false,
    reduce_vars: true,
    sequences: true,
    side_effects: true,
    switches: true,
    typeofs: true,
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
    bracketize: false,
    comments: false,
    ie8: false,
    indent_level: 0,
    indent_start: 0,
    inline_script: false,
    keep_quoted_props: false,
    max_line_len: false,
    preamble: null,
    preserve_line: false,
    quote_keys: false,
    quote_style: 0,
    semicolons: true,
    shebang: true,
    source_map: null,
    webkit: false,
    width: 80,
    wrap_iife: false
  }
};

