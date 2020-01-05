import * as d from '../../declarations';
import { hasError, normalizeFsPath } from '@utils';
import { parseStencilImportPathData } from '../../compiler/transformers/stencil-import-path';
import { Plugin } from 'rollup';
import { runPluginTransformsEsmImports } from '../../compiler/plugin/plugin';

export const extTransformsPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin => {
  return {
    name: 'extTransformsPlugin',

    async transform(_, id) {
      if (/\0/.test(id)) {
        return null;
      }
      const pathData = parseStencilImportPathData(id);
      if (pathData !== null) {
        // TODO, offline caching
        const filePath = normalizeFsPath(id);
        const code = await compilerCtx.fs.readFile(filePath);
        const pluginTransforms = await runPluginTransformsEsmImports(config, compilerCtx, code, filePath);
        const cssTransformResults = await compilerCtx.worker.transformCssToEsm({
          filePath: pluginTransforms.id,
          code: pluginTransforms.code,
          tagName: pathData.tag,
          encapsulation: pathData.encapsulation,
          modeName: pathData.mode,
          commentOriginalSelector: false,
          sourceMap: config.sourceMap,
          minify: config.minifyCss,
          autoprefixer: config.autoprefixCss
        });

        // Track dependencies
        pluginTransforms.dependencies.forEach(dep => {
          this.addWatchFile(dep);
        });

        buildCtx.diagnostics.push(...pluginTransforms.diagnostics);
        buildCtx.diagnostics.push(...cssTransformResults.diagnostics);
        const didError = hasError(cssTransformResults.diagnostics) || hasError(pluginTransforms.diagnostics);
        if (didError) {
          this.error('Plugin CSS transform error');
        }

        buildCtx.stylesUpdated.push({
          styleTag: pathData.tag,
          styleMode: pathData.mode,
          styleText: cssTransformResults.styleText,
        });

        return {
          code: cssTransformResults.code,
          map: cssTransformResults.map,
          moduleSideEffects: false
        };
      }
      return null;
    }
  };
};
