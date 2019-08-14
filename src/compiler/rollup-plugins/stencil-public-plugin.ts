import * as d from '../../declarations';
import { createCompiler } from '../browser/create-compiler';
import { Plugin } from 'rollup';


export const stencilRollupPlugin = (): Plugin => {
  const compiler = createCompiler();

  return {
    name: 'stencilPlugin',

    resolveId(importee: string, importer: string) {
      const r = compiler.resolveId(importee, importer);
      if (r != null) {
        return r.resolvedId;
      }
      return null;
    },

    async transform(code: string, id: string, opts: d.CompileOptions = {}) {
      return compiler.transform(code, id, opts);
    },

    writeBundle() {
      compiler.writeBuild();
    }
  };
};
