import { BuildCtx, CompilerCtx, Config } from '../../util/interfaces';
import { catchError } from '../util';
import { PluginTransformResults, PluginCtx } from './plugin-interfaces';
import { StyleMinifyPlugin } from '../style/style-minify-plugin';
import { StyleSassPlugin } from '../style/style-sass-plugin';


export function initPlugins(config: Config) {
  config.plugins = (config.plugins || []).filter(p => !!p);

  const styleSassPlugin = new StyleSassPlugin();
  config.plugins.push(styleSassPlugin);

  const styleMinifyPlugin = new StyleMinifyPlugin();
  config.plugins.push(styleMinifyPlugin);
}


export async function runPluginResolveId(pluginCtx: PluginCtx, importee: string) {
  for (let i = 0; i < pluginCtx.config.plugins.length; i++) {
    const plugin = pluginCtx.config.plugins[i];

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
        const d = catchError(pluginCtx.diagnostics, e);
        d.header = `${plugin.name} resolveId error`;
      }
    }
  }

  // default resolvedId
  return importee;
}


export async function runPluginLoad(pluginCtx: PluginCtx, id: string) {
  for (let i = 0; i < pluginCtx.config.plugins.length; i++) {
    const plugin = pluginCtx.config.plugins[i];

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
        const d = catchError(pluginCtx.diagnostics, e);
        d.header = `${plugin.name} load error`;
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

  for (let i = 0; i < config.plugins.length; i++) {
    const plugin = config.plugins[i];

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
        const d = catchError(buildCtx.diagnostics, e);
        d.header = `${plugin.name} transform error: ${id}`;
      }
    }
  }

  buildCtx.diagnostics.push(...pluginCtx.diagnostics);

  return transformResults;
}
