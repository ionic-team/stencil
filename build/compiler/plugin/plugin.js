import { buildError, catchError, isFunction, isOutputTargetDocs, isString, relative } from '@utils';
import { basename } from 'path';
import { parseCssImports } from '../style/css-imports';
export const runPluginResolveId = async (pluginCtx, importee) => {
    var _a, _b;
    for (const plugin of (_b = (_a = pluginCtx.config) === null || _a === void 0 ? void 0 : _a.plugins) !== null && _b !== void 0 ? _b : []) {
        if (isFunction(plugin.resolveId)) {
            try {
                const results = plugin.resolveId(importee, null, pluginCtx);
                if (results != null) {
                    if (isFunction(results.then)) {
                        const promiseResults = await results;
                        if (promiseResults != null) {
                            return promiseResults;
                        }
                    }
                    else if (isString(results)) {
                        return results;
                    }
                }
            }
            catch (e) {
                catchError(pluginCtx.diagnostics, e);
            }
        }
    }
    // default resolvedId
    return importee;
};
export const runPluginLoad = async (pluginCtx, id) => {
    var _a, _b;
    for (const plugin of (_b = (_a = pluginCtx.config) === null || _a === void 0 ? void 0 : _a.plugins) !== null && _b !== void 0 ? _b : []) {
        if (isFunction(plugin.load)) {
            try {
                const results = plugin.load(id, pluginCtx);
                if (results != null) {
                    if (isFunction(results.then)) {
                        const promiseResults = await results;
                        if (promiseResults != null) {
                            return promiseResults;
                        }
                    }
                    else if (isString(results)) {
                        return results;
                    }
                }
            }
            catch (e) {
                catchError(pluginCtx.diagnostics, e);
            }
        }
    }
    // default load()
    return pluginCtx.fs.readFile(id);
};
export const runPluginTransforms = async (config, compilerCtx, buildCtx, id, cmp) => {
    var _a, _b;
    const pluginCtx = {
        config: config,
        sys: config.sys,
        fs: compilerCtx.fs,
        cache: compilerCtx.cache,
        diagnostics: [],
    };
    const resolvedId = await runPluginResolveId(pluginCtx, id);
    const sourceText = await runPluginLoad(pluginCtx, resolvedId);
    if (!isString(sourceText)) {
        const diagnostic = buildError(buildCtx.diagnostics);
        diagnostic.header = `Unable to find "${basename(id)}"`;
        diagnostic.messageText = `The file "${relative(config.rootDir, id)}" was unable to load.`;
        return null;
    }
    const transformResults = {
        code: sourceText,
        id: id,
        dependencies: [],
    };
    const isRawCssFile = transformResults.id.toLowerCase().endsWith('.css');
    const shouldParseCssDocs = cmp != null && config.outputTargets.some(isOutputTargetDocs);
    if (isRawCssFile) {
        // concat all css @imports into one file
        // when the entry file is a .css file (not .scss)
        // do this BEFORE transformations on css files
        if (shouldParseCssDocs && cmp != null) {
            cmp.styleDocs = cmp.styleDocs || [];
            const cssParseResults = await parseCssImports(config, compilerCtx, buildCtx, id, id, transformResults.code, cmp.styleDocs);
            transformResults.code = cssParseResults.styleText;
            transformResults.dependencies = cssParseResults.imports;
        }
        else {
            const cssParseResults = await parseCssImports(config, compilerCtx, buildCtx, id, id, transformResults.code);
            transformResults.code = cssParseResults.styleText;
            transformResults.dependencies = cssParseResults.imports;
        }
    }
    for (const plugin of (_b = (_a = pluginCtx.config) === null || _a === void 0 ? void 0 : _a.plugins) !== null && _b !== void 0 ? _b : []) {
        if (isFunction(plugin.transform)) {
            try {
                let pluginTransformResults;
                const results = plugin.transform(transformResults.code, transformResults.id, pluginCtx);
                if (results != null) {
                    if (isFunction(results.then)) {
                        pluginTransformResults = await results;
                    }
                    else {
                        pluginTransformResults = results;
                    }
                    if (pluginTransformResults != null) {
                        if (isString(pluginTransformResults)) {
                            transformResults.code = pluginTransformResults;
                        }
                        else {
                            if (isString(pluginTransformResults.code)) {
                                transformResults.code = pluginTransformResults.code;
                            }
                            if (isString(pluginTransformResults.id)) {
                                transformResults.id = pluginTransformResults.id;
                            }
                        }
                    }
                }
            }
            catch (e) {
                catchError(buildCtx.diagnostics, e);
            }
        }
    }
    buildCtx.diagnostics.push(...pluginCtx.diagnostics);
    if (!isRawCssFile) {
        // sass precompiler just ran and converted @import "my.css" into @import url("my.css")
        // because of the ".css" extension. Sass did NOT concat the ".css" files into the output
        // but only updated it to use url() instead. Let's go ahead and concat the url() css
        // files into one file like we did for raw .css files.
        // do this AFTER transformations on non-css files
        if (shouldParseCssDocs && cmp != null) {
            cmp.styleDocs = cmp.styleDocs || [];
            const cssParseResults = await parseCssImports(config, compilerCtx, buildCtx, id, transformResults.id, transformResults.code, cmp.styleDocs);
            transformResults.code = cssParseResults.styleText;
            transformResults.dependencies = cssParseResults.imports;
        }
        else {
            const cssParseResults = await parseCssImports(config, compilerCtx, buildCtx, id, transformResults.id, transformResults.code);
            transformResults.code = cssParseResults.styleText;
            transformResults.dependencies = cssParseResults.imports;
        }
    }
    return transformResults;
};
export const runPluginTransformsEsmImports = async (config, compilerCtx, buildCtx, code, id) => {
    var _a, _b;
    const pluginCtx = {
        config: config,
        sys: config.sys,
        fs: compilerCtx.fs,
        cache: compilerCtx.cache,
        diagnostics: [],
    };
    const transformResults = {
        code,
        id,
        map: undefined,
        diagnostics: [],
        dependencies: [],
    };
    const isRawCssFile = id.toLowerCase().endsWith('.css');
    if (isRawCssFile) {
        // concat all css @imports into one file
        // when the entry file is a .css file (not .scss)
        // do this BEFORE transformations on css files
        const cssParseResults = await parseCssImports(config, compilerCtx, buildCtx, id, id, transformResults.code);
        transformResults.code = cssParseResults.styleText;
        if (Array.isArray(cssParseResults.imports)) {
            transformResults.dependencies.push(...cssParseResults.imports);
        }
    }
    for (const plugin of (_b = (_a = pluginCtx.config) === null || _a === void 0 ? void 0 : _a.plugins) !== null && _b !== void 0 ? _b : []) {
        if (isFunction(plugin.transform)) {
            try {
                let pluginTransformResults;
                const results = plugin.transform(transformResults.code, transformResults.id, pluginCtx);
                if (results != null) {
                    if (isFunction(results.then)) {
                        pluginTransformResults = await results;
                    }
                    else {
                        pluginTransformResults = results;
                    }
                    if (pluginTransformResults != null) {
                        if (isString(pluginTransformResults)) {
                            transformResults.code = pluginTransformResults;
                        }
                        else {
                            if (isString(pluginTransformResults.code)) {
                                transformResults.code = pluginTransformResults.code;
                            }
                            if (isString(pluginTransformResults.id)) {
                                transformResults.id = pluginTransformResults.id;
                            }
                            if (Array.isArray(pluginTransformResults.dependencies)) {
                                const imports = pluginTransformResults.dependencies.filter((f) => !transformResults.dependencies.includes(f));
                                transformResults.dependencies.push(...imports);
                            }
                        }
                    }
                }
            }
            catch (e) {
                catchError(transformResults.diagnostics, e);
            }
        }
    }
    transformResults.diagnostics.push(...pluginCtx.diagnostics);
    if (!isRawCssFile) {
        // precompilers just ran and converted @import "my.css" into @import url("my.css")
        // because of the ".css" extension. Precompilers did NOT concat the ".css" files into
        // the output but only updated it to use url() instead. Let's go ahead and concat
        // the url() css files into one file like we did for raw .css files. Do this
        // AFTER transformations on non-css files
        const cssParseResults = await parseCssImports(config, compilerCtx, buildCtx, id, transformResults.id, transformResults.code);
        transformResults.code = cssParseResults.styleText;
        if (Array.isArray(cssParseResults.imports)) {
            const imports = cssParseResults.imports.filter((f) => !transformResults.dependencies.includes(f));
            transformResults.dependencies.push(...imports);
        }
    }
    return transformResults;
};
//# sourceMappingURL=plugin.js.map