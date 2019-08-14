import * as d from '../../declarations';
import { createCompiler } from '../browser/create-compiler';
import { Plugin } from 'rollup';
import { runPluginTransformsEsmImports } from '../plugin/plugin';


export const cssTransformer = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin => {
  const compiler = createCompiler();

  return {
    name: 'cssTransformer',

    resolveId(importee: string, importer: string) {
      const r = compiler.resolveId(importee, importer);
      if (r != null && r.type === 'css') {
        if (KNOWN_PREPROCESSOR_EXTS.has(r.importerExt) && r.importerExt !== r.resolvedFileExt) {
          // basically for sass paths without an extension
          r.resolvedFileExt = r.importerExt;
          r.resolvedFileName += '.' + r.resolvedFileExt;
          r.resolvedFilePath += '.' + r.resolvedFileExt;
          r.resolvedId = `${r.resolvedFilePath}?${r.params}`;
          compiler.setResolvedData(r.resolvedId, r);
        }
        return r.resolvedId;
      }
      return null;
    },

    async transform(code: string, id: string) {
      const r = compiler.getResolvedData(id);
      if (r != null) {
        const pluginTransforms = await runPluginTransformsEsmImports(config, compilerCtx, buildCtx, code, id);
        const results = await compiler.transform(pluginTransforms.code, id);
        if (results != null) {
          buildCtx.diagnostics.push(...results.diagnostics);
          return results;
        }
      }
      return null;
    }
  };
};

const KNOWN_PREPROCESSOR_EXTS = new Set(['sass', 'scss', 'styl', 'less', 'pcss']);
