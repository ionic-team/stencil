import * as d from '../../declarations';
import { parseStencilImportPath } from '../transformers/stencil-import-path';
import { compile } from './compile';


export const createCompiler = () => {
  const stencilResolved = new Map<string, d.ResolvedStencilData>();
  const diagnostics: d.Diagnostic[] = [];

  const defaultOpts: d.CompileOptions = {};

  const reset = () => {
    stencilResolved.clear();
    diagnostics.length = 0;
  };

  const getResolvedData = (id: string) => {
    return stencilResolved.get(id);
  };

  const setResolvedData = (id: string, r: d.ResolvedStencilData) => {
    return stencilResolved.set(id, r);
  };

  return {

    resolveId(importee: string, importer: string) {
      // import Css from 'stencil?tag=cmp-a&scopeId=sc-cmp-a-md&mode=md!./filepath.css
      const r = parseStencilImportPath(importee, importer);
      if (r != null) {
        setResolvedData(r.resolvedId, r);
        return r;
      }
      return null;
    },

    getLoadPath(filePath: string) {
      if (typeof filePath === 'string') {
        return filePath.split('?')[0];
      }
      return null;
    },

    async transform(code: string, filePath: string, opts?: d.CompileOptions) {
      const r = getResolvedData(filePath);
      if (r != null) {
        const compileOpts = Object.assign({}, defaultOpts, opts);
        compileOpts.type = r.type;
        compileOpts.file = r.resolvedFilePath;
        compileOpts.data = r.data;

        const results = await compile(code, compileOpts);

        return {
          code: results.code,
          map: results.map,
          diagnostics: results.diagnostics
        };
      }
      return null;
    },

    writeBuild() {
      reset();
    },

    reset,
    getResolvedData,
    setResolvedData,
  };
};
