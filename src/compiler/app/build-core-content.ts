import * as d from '../../declarations';
import { RESERVED_PROPERTIES } from './reserved-properties';
import { transpileCoreBuild } from '../transpile/core-es5-build';
import { replaceBuildString } from '../../util/text-manipulation';


export async function buildCoreContent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, coreBuild: d.BuildConditionals, coreContent: string) {
  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
    return '';
  }

  // Replace all _BUILD_ with the current coreBuild obj
  const replaceObj = Object.keys(coreBuild).reduce((all, key) => {
    all[`_BUILD_.${key}`] = coreBuild[key];
    return all;
  }, <{ [key: string]: any}>{});

  let replacedContent = replaceBuildString(coreContent, replaceObj);

  // If this is an es5 build then transpile the code down to es5 using Typescript.
  if (coreBuild.es5) {
    const transpileResults = await transpileCoreBuild(config, compilerCtx, coreBuild, replacedContent);

    if (transpileResults.diagnostics && transpileResults.diagnostics.length > 0) {
      buildCtx.diagnostics.push(...transpileResults.diagnostics);
      return replacedContent;
    }

    replacedContent = transpileResults.code;
  }

  const sourceTarget: d.SourceTarget = coreBuild.es5 ? 'es5' : 'es2017';

  const minifyResults = await minifyCore(config, compilerCtx, sourceTarget, replacedContent);

  if (minifyResults.diagnostics.length > 0) {
    buildCtx.diagnostics.push(...minifyResults.diagnostics);
    return replacedContent;
  }

  return minifyResults.output;
}


export async function minifyCore(config: d.Config, compilerCtx: d.CompilerCtx, sourceTarget: d.SourceTarget, input: string) {
  const opts: any = Object.assign({}, config.minifyJs ? PROD_MINIFY_OPTS : DEV_MINIFY_OPTS);

  if (sourceTarget === 'es5') {
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
    await compilerCtx.cache.put(cacheKey, results.output);
  }

  return results;
}


// https://www.npmjs.com/package/terser
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
    keep_fargs: false,
    keep_fnames: true,
    keep_infinity: true,
    loops: true,
    negate_iife: false,
    passes: 3,
    properties: true,
    pure_funcs: null,
    pure_getters: false,
    reduce_vars: true,
    sequences: true,
    side_effects: true,
    switches: true,
    toplevel: true,
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
};

