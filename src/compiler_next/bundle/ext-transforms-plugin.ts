import * as d from '../../declarations';
import { normalizeFsPath } from '@utils';
import { parseStencilImportPathData } from '../../compiler/transformers/stencil-import-path';
import { Plugin } from 'rollup';
import { runPluginTransformsEsmImports } from '../../compiler/plugin/plugin';


export const extTransformsPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin => {
  return {
    name: 'extTransformsPlugin',

    async transform(code, id) {
      const pathData = parseStencilImportPathData(id);
      if (pathData != null) {
        const filePath = normalizeFsPath(id);
        const pluginTransforms = await runPluginTransformsEsmImports(config, compilerCtx, buildCtx, code, filePath);
        const cssTransformResults = await compilerCtx.worker.transformCssToEsm({
          filePath: pluginTransforms.id,
          code: pluginTransforms.code,
          tagName: pathData.tag,
          encapsulation: pathData.encapsulation,
          modeName: pathData.mode,
          commentOriginalSelector: false,
          sourceMap: config.sourceMap,
        });
        buildCtx.diagnostics.push(...cssTransformResults.diagnostics);

        return {
          code: cssTransformResults.code,
          map: cssTransformResults.map,
        };
      }
      return null;
    }
  };
};

// const KNOWN_PREPROCESSOR_EXTS = new Set(['sass', 'scss', 'styl', 'less', 'pcss']);
