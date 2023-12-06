import sourceMapMerge from 'merge-source-map';
import ts from 'typescript';
import { minfyJsId } from '../../version';
import { minifyJs } from './minify-js';
/**
 * Begins the process of minifying a user's JavaScript
 * @param config the Stencil configuration file that was provided as a part of the build step
 * @param compilerCtx the current compiler context
 * @param opts minification options that specify how the JavaScript ought to be minified
 * @returns the minified JavaScript result
 */
export const optimizeModule = async (config, compilerCtx, opts) => {
    if ((!opts.minify && opts.sourceTarget !== 'es5') || opts.input === '') {
        return {
            output: opts.input,
            diagnostics: [],
            sourceMap: opts.sourceMap,
        };
    }
    const isDebug = config.logLevel === 'debug';
    const cacheKey = await compilerCtx.cache.createKey('optimizeModule', minfyJsId, opts, isDebug);
    const cachedContent = await compilerCtx.cache.get(cacheKey);
    if (cachedContent != null) {
        const cachedMap = await compilerCtx.cache.get(cacheKey + 'Map');
        return {
            output: cachedContent,
            diagnostics: [],
            sourceMap: cachedMap ? JSON.parse(cachedMap) : null,
        };
    }
    let minifyOpts;
    let code = opts.input;
    if (opts.isCore) {
        // IS_ESM_BUILD is replaced at build time so SystemJS and esm builds have diff values
        // not using the BUILD conditional since rollup would input the same value
        code = code.replace(/\/\* IS_ESM_BUILD \*\//g, '&& false /* IS_SYSTEM_JS_BUILD */');
    }
    if (opts.sourceTarget === 'es5' || opts.minify) {
        minifyOpts = getTerserOptions(config, opts.sourceTarget, isDebug);
        if (config.sourceMap) {
            minifyOpts.sourceMap = {
                content: 
                // We need to loosely check for a source map definition
                // so we don't spread a `null`/`undefined` value into the object
                // which results in invalid source maps during minification
                opts.sourceMap != null
                    ? {
                        ...opts.sourceMap,
                        version: 3,
                    }
                    : undefined,
            };
        }
        const compressOpts = minifyOpts.compress;
        const mangleOptions = minifyOpts.mangle;
        if (opts.sourceTarget !== 'es5' && opts.isCore) {
            if (!isDebug) {
                compressOpts.passes = 2;
                compressOpts.global_defs = {
                    supportsListenerOptions: true,
                };
                compressOpts.pure_funcs = compressOpts.pure_funcs || [];
                compressOpts.pure_funcs = ['getHostRef', ...compressOpts.pure_funcs];
            }
            mangleOptions.properties = {
                debug: isDebug,
                ...getTerserManglePropertiesConfig(),
            };
            compressOpts.inline = 1;
            compressOpts.unsafe = true;
            compressOpts.unsafe_undefined = true;
        }
    }
    const shouldTranspile = opts.sourceTarget === 'es5';
    const results = await compilerCtx.worker.prepareModule(code, minifyOpts, shouldTranspile, !!opts.inlineHelpers);
    if (results != null &&
        typeof results.output === 'string' &&
        results.diagnostics.length === 0 &&
        compilerCtx != null) {
        if (opts.isCore) {
            results.output = results.output.replace(/disconnectedCallback\(\)\{\},/g, '');
        }
        await compilerCtx.cache.put(cacheKey, results.output);
        if (results.sourceMap) {
            await compilerCtx.cache.put(cacheKey + 'Map', JSON.stringify(results.sourceMap));
        }
    }
    return results;
};
/**
 * Builds a configuration object to be used by Terser for the purposes of minifying a user's JavaScript
 * @param config the Stencil configuration file that was provided as a part of the build step
 * @param sourceTarget the version of JavaScript being targeted (e.g. ES2017)
 * @param prettyOutput if true, set the necessary flags to beautify the output of terser
 * @returns the minification options
 */
export const getTerserOptions = (config, sourceTarget, prettyOutput) => {
    const opts = {
        ie8: false,
        safari10: false,
        format: {},
        sourceMap: config.sourceMap,
    };
    if (sourceTarget === 'es5') {
        opts.ecma = opts.format.ecma = 5;
        opts.compress = false;
        opts.mangle = {
            properties: getTerserManglePropertiesConfig(),
        };
    }
    else {
        opts.mangle = {
            properties: getTerserManglePropertiesConfig(),
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
        opts.mangle = {
            keep_fnames: true,
            properties: getTerserManglePropertiesConfig(),
        };
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
/**
 * Get baseline configuration for the 'properties' option for terser's mangle
 * configuration.
 *
 * @returns an object with our baseline property mangling configuration
 */
function getTerserManglePropertiesConfig() {
    const options = {
        regex: '^\\$.+\\$$',
        // we need to reserve this name so that it can be accessed on `hostRef`
        // at runtime
        reserved: ['$hostElement$'],
    };
    return options;
}
/**
 * This method is likely to be called by a worker on the compiler context, rather than directly.
 * @param input the source code to minify
 * @param minifyOpts options to be used by the minifier
 * @param transpileToEs5 if true, use the TypeScript compiler to transpile the input to ES5 prior to minification
 * @param inlineHelpers when true, emits less terse JavaScript by allowing global helpers created by the TypeScript
 * compiler to be added directly to the transpiled source. Used only if `transpileToEs5` is true.
 * @returns minified input, as JavaScript
 */
export const prepareModule = async (input, minifyOpts, transpileToEs5, inlineHelpers) => {
    var _a, _b;
    const results = {
        output: input,
        diagnostics: [],
        sourceMap: null,
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
            const mergeMap = sourceMapMerge((_a = minifyOpts.sourceMap) === null || _a === void 0 ? void 0 : _a.content, JSON.parse(tsResults.sourceMapText));
            if (mergeMap != null) {
                minifyOpts.sourceMap = {
                    content: {
                        ...mergeMap,
                        sources: (_b = mergeMap.sources) !== null && _b !== void 0 ? _b : [],
                        version: 3,
                    },
                };
            }
        }
    }
    if (minifyOpts) {
        return minifyJs(results.output, minifyOpts);
    }
    return results;
};
//# sourceMappingURL=optimize-module.js.map