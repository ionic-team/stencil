import { BuildCtx, CompilerCtx, Config } from '../../declarations';
import { catchError } from '../util';
import { PluginCtx, PluginTransformResults } from '../../declarations/plugin';


export async function runPluginResolveId(pluginCtx: PluginCtx, importee: string) {
  for (const plugin of pluginCtx.config.plugins) {

    if (typeof plugin.resolveId === 'function') {
      try {
        const results = plugin.resolveId(importee, null, pluginCtx);

        if (results != null) {
          if (typeof results.then === 'function') {
            const promiseResults = await results;
            if (promiseResults != null) {
              return promiseResults as string;
            }

          } else if (typeof results === 'string') {
            return results as string;
          }
        }

      } catch (e) {
        catchError(pluginCtx.diagnostics, e);
      }
    }
  }

  // default resolvedId
  return importee;
}


export async function runPluginLoad(pluginCtx: PluginCtx, id: string) {
  for (const plugin of pluginCtx.config.plugins) {

    if (typeof plugin.load === 'function') {
      try {
        const results = plugin.load(id, pluginCtx);

        if (results != null) {
          if (typeof results.then === 'function') {
            const promiseResults = await results;
            if (promiseResults != null) {
              return promiseResults as string;
            }

          } else if (typeof results === 'string') {
            return results as string;
          }
        }

      } catch (e) {
        catchError(pluginCtx.diagnostics, e);
      }
    }
  }

  // default load()
  return pluginCtx.fs.readFile(id);
}


export async function runPluginTransforms(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, id: string) {
  const pluginCtx: PluginCtx = {
    config: config,
    sys: config.sys,
    fs: compilerCtx.fs,
    cache: compilerCtx.cache,
    diagnostics: []
  };

  const resolvedId = await runPluginResolveId(pluginCtx, id);
  const sourceText = await runPluginLoad(pluginCtx, resolvedId);

  const transformResults: PluginTransformResults = {
    code: sourceText,
    id: id
  };

  for (const plugin of pluginCtx.config.plugins) {

    if (typeof plugin.transform === 'function') {
      try {
        let pluginTransformResults: PluginTransformResults;
        const results = plugin.transform(transformResults.code, transformResults.id, pluginCtx);

        if (results != null) {
          if (typeof results.then === 'function') {
            pluginTransformResults = await results;

          } else {
            pluginTransformResults = results as PluginTransformResults;
          }

          if (pluginTransformResults != null) {
            if (typeof pluginTransformResults === 'string') {
              transformResults.code = pluginTransformResults as string;

            } else {
              if (typeof pluginTransformResults.code === 'string') {
                transformResults.code = pluginTransformResults.code;
              }
              if (typeof pluginTransformResults.id === 'string') {
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

  return transformResults;
}
