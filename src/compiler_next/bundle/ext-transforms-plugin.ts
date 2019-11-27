import * as d from '../../declarations';
import { hasError, normalizeFsPath } from '@utils';
import { parseStencilImportPathData } from '../../compiler/transformers/stencil-import-path';
import { Plugin } from 'rollup';
import { runPluginTransformsEsmImports } from '../../compiler/plugin/plugin';


const dependendencies = new Map<string, string[]>();
export const extTransformsPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin => {
  return {
    name: 'extTransformsPlugin',

    load(id) {
      const fsFilePath = normalizeFsPath(id);
      const deps = dependendencies.get(fsFilePath);
      if (deps && deps.length > 0) {
        const prefix = '//' + deps
          .map(dep => `${compilerCtx.fs.revision(dep)}`)
          .join(',');

        return compilerCtx.fs.readFile(fsFilePath).then(content => {
          return prefix + '\n' + content;
        });
      }
      return null;
    },
    async transform(_, id) {
      const pathData = parseStencilImportPathData(id);
      if (pathData != null) {
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
        });
        dependendencies.set(filePath, pluginTransforms.dependencies);
        buildCtx.diagnostics.push(...pluginTransforms.diagnostics);
        buildCtx.diagnostics.push(...cssTransformResults.diagnostics);
        const didError = hasError(cssTransformResults.diagnostics) || hasError(pluginTransforms.diagnostics);
        if (didError) {
          this.error('Plugin CSS transform error');
        }
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

// const KNOWN_PREPROCESSOR_EXTS = new Set(['sass', 'scss', 'styl', 'less', 'pcss']);
