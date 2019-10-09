import * as d from '../../declarations';
import { buildError } from '@utils';
import { parseStencilImportPath } from '../../compiler/transformers/stencil-import-path';
import { Plugin } from 'rollup';
import { runPluginTransformsEsmImports } from '../../compiler/plugin/plugin';
import { transformCssToEsm } from '../../compiler/style/css-to-esm';


export const extensionTransformerPlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin => {
  const extResolved = new Map<string, d.ResolvedStencilData>();

  return {
    name: 'extensionTransformerPlugin',

    async resolveId(importee, importer) {
      // import Css from '\0stencil?tag=cmp-a&scopeId=sc-cmp-a-md&mode=md!./filepath.css
      const r = parseStencilImportPath(importee, importer);
      if (r) {
        const fileExists = await compilerCtx.fs.access(r.resolvedFilePath);
        if (fileExists) {
          extResolved.set(r.resolvedId, r);
          return r.resolvedId;

        } else {
          const diagnostic = buildError(buildCtx.diagnostics);
          diagnostic.header = `File Not Found`;
          diagnostic.absFilePath = r.importer;
          if (r.data) {
            diagnostic.messageText = `The import "${r.resolvedFilePath}" for the "${r.data.tag}" component cannot be found from "${r.importer}".`;
          } else {
            diagnostic.messageText = `The import "${r.resolvedFilePath}" cannot be found from "${r.importer}".`;
          }
        }
      }
      return null;
    },

    async transform(code, id) {
      const r = extResolved.get(id);
      if (r) {
        const pluginTransforms = await runPluginTransformsEsmImports(config, compilerCtx, buildCtx, code, id);

        const results = transformCssToEsm(config, pluginTransforms.code, r.resolvedFilePath, r.data.tag, r.data.encapsulation, r.data.mode);

        return results;
      }
      return null;
    }
  };
};

// const KNOWN_PREPROCESSOR_EXTS = new Set(['sass', 'scss', 'styl', 'less', 'pcss']);
