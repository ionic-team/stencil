import { minfyJsId } from '../../version';
import { minifyJs } from './minify-js';
import type { CompilerCtx, Config, Diagnostic, SourceTarget, SourceMap } from '../../declarations';
import type { CompressOptions, MangleOptions, MinifyOptions, SourceMapOptions } from 'terser';
import sourceMapMerge from 'merge-source-map';
import ts from 'typescript';

interface OptimizeModuleOptions {
  input: string;
  sourceMap?: SourceMap;
  sourceTarget?: SourceTarget;
  isCore?: boolean;
  minify?: boolean;
  inlineHelpers?: boolean;
  modeName?: string;
}

export const optimizeModule = async (config: Config, compilerCtx: CompilerCtx, opts: OptimizeModuleOptions) => {
  if ((!opts.minify && opts.sourceTarget !== 'es5') || opts.input === '') {
    return {
      output: opts.input,
      diagnostics: [] as Diagnostic[],
      sourceMap: opts.sourceMap as SourceMap
    };
  }
  const isDebug = config.logLevel === 'debug';
  const cacheKey = await compilerCtx.cache.createKey('optimizeModule', minfyJsId, opts, isDebug);
  const cachedContent = await compilerCtx.cache.get(cacheKey);
  if (cachedContent != null) {
    const cachedMap = await compilerCtx.cache.get(cacheKey + 'Map');
    return {
      output: cachedContent,
      diagnostics: [] as Diagnostic[],
      sourceMap: cachedMap ? JSON.parse(cachedMap) as SourceMap : null
    };
  }

  let minifyOpts: MinifyOptions;
  let code = opts.input;
  if (opts.isCore) {
    // IS_ESM_BUILD is replaced at build time so systemjs and esm builds have diff values
    // not using the BUILD conditional since rollup would input the same value
    code = code.replace(/\/\* IS_ESM_BUILD \*\//g, '&& false /* IS_SYSTEM_JS_BUILD */');
  }

  if (opts.sourceTarget === 'es5' || opts.minify) {
    minifyOpts = getTerserOptions(config, opts.sourceTarget, isDebug);
    if (config.sourceMap) minifyOpts.sourceMap = { content: opts.sourceMap }

    const compressOpts = minifyOpts.compress as CompressOptions;
    const mangleOptions = minifyOpts.mangle as MangleOptions;

    if (opts.sourceTarget !== 'es5' && opts.isCore) {
      if (!isDebug) {
        compressOpts.passes = 2;
        compressOpts.global_defs = {
          'supportsListenerOptions': true,
          'plt.$cssShim$': false,
        };
        compressOpts.pure_funcs = compressOpts.pure_funcs || [];
        compressOpts.pure_funcs = ['getHostRef', ...compressOpts.pure_funcs];
      }

      mangleOptions.properties = {
        regex: '^\\$.+\\$$',
        debug: isDebug,
      };

      compressOpts.inline = 1;
      compressOpts.unsafe = true;
      compressOpts.unsafe_undefined = true;
    }
  }

  const shouldTranspile = opts.sourceTarget === 'es5';
  const results = await compilerCtx.worker.prepareModule(code, minifyOpts, shouldTranspile, opts.inlineHelpers);
  if (results != null && typeof results.output === 'string' && results.diagnostics.length === 0 && compilerCtx != null) {
    if (opts.isCore) {
      results.output = results.output.replace(/disconnectedCallback\(\)\{\},/g, '');
    }
    await compilerCtx.cache.put(cacheKey, results.output);
    if (results.sourceMap) await compilerCtx.cache.put(cacheKey + 'Map', JSON.stringify(results.sourceMap));
  }

  return results;
};

export const getTerserOptions = (config: Config, sourceTarget: SourceTarget, prettyOutput: boolean) => {
  const opts: MinifyOptions = {
    ie8: false,
    safari10: !!config.extras.safari10,
    format: {},
    sourceMap: !!config.sourceMap
  };

  if (sourceTarget === 'es5') {
    opts.ecma = opts.format.ecma = 5;
    opts.compress = false;
    opts.mangle = true;
  } else {
    opts.mangle = {
      properties: {
        regex: '^\\$.+\\$$',
      },
    };
    opts.compress = {
      pure_getters: true,
      keep_fargs: false,
      passes: 2,
    };

    opts.ecma = opts.format.ecma = opts.compress.ecma = 2018;
    opts.toplevel = true;
    opts.module = true;
    opts.mangle.toplevel = true;
    opts.compress.arrows = true;
    opts.compress.module = true;
    opts.compress.toplevel = true;
  }

  if (prettyOutput) {
    opts.mangle = { keep_fnames: true };
    opts.compress = {};
    opts.compress.drop_console = false;
    opts.compress.drop_debugger = false;
    opts.compress.pure_funcs = [];
    opts.format.beautify = true;
    opts.format.indent_level = 2;
    opts.format.comments = 'all';
  }

  return opts;
};

export const prepareModule = async (input: string, minifyOpts: MinifyOptions, transpileToEs5: boolean, inlineHelpers: boolean) => {
  const results = {
    output: input,
    diagnostics: [] as Diagnostic[],
    sourceMap: null as SourceMap
  };

  if (transpileToEs5) {
    const tsResults = ts.transpileModule(input, {
      fileName: 'module.ts',
      compilerOptions: {
        sourceMap: !!minifyOpts.sourceMap,
        allowJs: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.ESNext,
        removeComments: false,
        isolatedModules: true,
        skipLibCheck: true,
        noEmitHelpers: !inlineHelpers,
        importHelpers: !inlineHelpers,
      },
      reportDiagnostics: false,
    });
    results.output = tsResults.outputText;

    if (tsResults.sourceMapText) {
      // need to merge sourcemaps at this point
      const mergeMap = sourceMapMerge(
        (minifyOpts.sourceMap as SourceMapOptions).content as SourceMap,
        JSON.parse(tsResults.sourceMapText)
      ) as SourceMap;
      minifyOpts.sourceMap = {content: mergeMap};
    }
  }

  if (minifyOpts) {
    return minifyJs(results.output, minifyOpts);
  }

  return results;
};
