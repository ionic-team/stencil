import * as d from '../../declarations';
import { createCompiler } from '../browser/create-compiler';
import { Plugin } from 'rollup';


export const cssTransformer = (buildCtx: d.BuildCtx): Plugin => {
  const compiler = createCompiler();

  return {
    name: 'cssTransformer',
    resolveId(importee: string, importer: string) {
      return compiler.resolveId(importee, importer);
    },

    async transform(code: string, id: string) {
      const results = await compiler.transform(code, id);
      if (results != null) {
        buildCtx.diagnostics.push(...results.diagnostics);
        return results;
      }
      return null;
    }
  };
};
