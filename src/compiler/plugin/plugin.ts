import type * as d from '../../declarations';
import { basename, relative } from 'path';
import { buildError, catchError, isFunction, isString } from '@utils';
import { isOutputTargetDocs } from '../output-targets/output-utils';
import { parseCssImports } from '../style/css-imports';
import { PluginCtx, PluginTransformResults } from '../../declarations';

export const runPluginResolveId = async (pluginCtx: PluginCtx, importee: string) => {
  for (const plugin of pluginCtx.config.plugins) {
    if (isFunction(plugin.resolveId)) {
      try {
        const results = plugin.resolveId(importee, null, pluginCtx);

        if (results != null) {
          if (isFunction((results as any).then)) {
            const promiseResults = await results;
            if (promiseResults != null) {
              return promiseResults as string;
            }
          } else if (isString(results)) {
            return results;
          }
        }
      } catch (e) {
        catchError(pluginCtx.diagnostics, e);
      }
    }
  }

  // default resolvedId
  return importee;
};

export const runPluginLoad = async (pluginCtx: PluginCtx, id: string) => {
  for (const plugin of pluginCtx.config.plugins) {
    if (isFunction(plugin.load)) {
      try {
        const results = plugin.load(id, pluginCtx);

        if (results != null) {
          if (isFunction((results as any).then)) {
            const promiseResults = await results;
            if (promiseResults != null) {
              return promiseResults as string;
            }
          } else if (isString(results)) {
            return results;
          }
        }
      } catch (e) {
        catchError(pluginCtx.diagnostics, e);
      }
    }
  }

  // default load()
  return pluginCtx.fs.readFile(id);
};

export const runPluginTransforms = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  id: string,
  cmp?: d.ComponentCompilerMeta
) => {
  const pluginCtx: PluginCtx = {
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

  const transformResults: PluginTransformResults = {
    code: sourceText,
    id: id,
  };

  const isRawCssFile = transformResults.id.toLowerCase().endsWith('.css');
  const shouldParseCssDocs = cmp != null && config.outputTargets.some(isOutputTargetDocs);

  if (isRawCssFile) {
    // concat all css @imports into one file
    // when the entry file is a .css file (not .scss)
    // do this BEFORE transformations on css files
    if (shouldParseCssDocs && cmp != null) {
      cmp.styleDocs = cmp.styleDocs || [];
      const cssParseResults = await parseCssImports(
        config,
        compilerCtx,
        buildCtx,
        id,
        id,
        transformResults.code,
        cmp.styleDocs
      );
      transformResults.code = cssParseResults.styleText;
      transformResults.dependencies = cssParseResults.imports;
    } else {
      const cssParseResults = await parseCssImports(config, compilerCtx, buildCtx, id, id, transformResults.code);
      transformResults.code = cssParseResults.styleText;
      transformResults.dependencies = cssParseResults.imports;
    }
  }

  for (const plugin of pluginCtx.config.plugins) {
    if (isFunction(plugin.transform)) {
      try {
        let pluginTransformResults: PluginTransformResults | string;
        const results = plugin.transform(transformResults.code, transformResults.id, pluginCtx);

        if (results != null) {
          if (isFunction((results as any).then)) {
            pluginTransformResults = await results;
          } else {
            pluginTransformResults = results as PluginTransformResults;
          }

          if (pluginTransformResults != null) {
            if (isString(pluginTransformResults)) {
              transformResults.code = pluginTransformResults;
            } else {
              if (isString(pluginTransformResults.code)) {
                transformResults.code = pluginTransformResults.code;
              }
              if (isString(pluginTransformResults.id)) {
                transformResults.id = pluginTransformResults.id;
              }
            }
          }
        }
      } catch (e) {
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
      const cssParseResults = await parseCssImports(
        config,
        compilerCtx,
        buildCtx,
        id,
        transformResults.id,
        transformResults.code,
        cmp.styleDocs
      );
      transformResults.code = cssParseResults.styleText;
      transformResults.dependencies = cssParseResults.imports;
    } else {
      const cssParseResults = await parseCssImports(
        config,
        compilerCtx,
        buildCtx,
        id,
        transformResults.id,
        transformResults.code
      );
      transformResults.code = cssParseResults.styleText;
      transformResults.dependencies = cssParseResults.imports;
    }
  }

  return transformResults;
};

export const runPluginTransformsEsmImports = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  code: string,
  id: string
) => {
  const pluginCtx: PluginCtx = {
    config: config,
    sys: config.sys,
    fs: compilerCtx.fs,
    cache: compilerCtx.cache,
    diagnostics: [],
  };

  const transformResults: PluginTransformResults = {
    code,
    id,
    map: null,
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

  for (const plugin of pluginCtx.config.plugins) {
    if (isFunction(plugin.transform)) {
      try {
        let pluginTransformResults: PluginTransformResults | string;
        const results = plugin.transform(transformResults.code, transformResults.id, pluginCtx);
        if (results != null) {
          if (isFunction((results as any).then)) {
            pluginTransformResults = await results;
          } else {
            pluginTransformResults = results as PluginTransformResults;
          }

          if (pluginTransformResults != null) {
            if (isString(pluginTransformResults)) {
              transformResults.code = pluginTransformResults as string;
            } else {
              if (isString(pluginTransformResults.code)) {
                transformResults.code = pluginTransformResults.code;
              }
              if (isString(pluginTransformResults.id)) {
                transformResults.id = pluginTransformResults.id;
              }
              if (Array.isArray(pluginTransformResults.dependencies)) {
                const imports = pluginTransformResults.dependencies.filter(
                  (f) => !transformResults.dependencies.includes(f)
                );
                transformResults.dependencies.push(...imports);
              }
            }
          }
        }
      } catch (e) {
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
    const cssParseResults = await parseCssImports(
      config,
      compilerCtx,
      buildCtx,
      id,
      transformResults.id,
      transformResults.code
    );
    transformResults.code = cssParseResults.styleText;
    if (Array.isArray(cssParseResults.imports)) {
      const imports = cssParseResults.imports.filter((f) => !transformResults.dependencies.includes(f));
      transformResults.dependencies.push(...imports);
    }
  }

  return transformResults;
};
