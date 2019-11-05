import * as d from '../../declarations';
import { isString, normalizeFsPath } from '@utils';
import { parseStencilImportPathData } from '../../compiler/transformers/stencil-import-path';
import { Plugin } from 'rollup';
import { runPluginTransformsEsmImports } from '../../compiler/plugin/plugin';


export const extTransformsPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin => {
  return {
    name: 'extTransformsPlugin',

    async load(id) {
      const filePath = normalizeFsPath(id);
      const code = await compilerCtx.fs.readFile(filePath);

      if (isString(code)) {
        const pluginTransforms = await runPluginTransformsEsmImports(config, compilerCtx, buildCtx, code, filePath);

        const pathData = parseStencilImportPathData(id);
        if (pathData != null) {
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

        return {
          code: pluginTransforms.code,
          map: pluginTransforms.map
        };
      }

      return null;
    }
  };
};

// const KNOWN_PREPROCESSOR_EXTS = new Set(['sass', 'scss', 'styl', 'less', 'pcss']);
