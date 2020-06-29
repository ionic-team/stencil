import { Plugin } from 'rollup';
import fetch from 'node-fetch';
import ts from 'typescript';

export function denoStdPlugin(): Plugin {
  return {
    name: 'denoStdPlugin',
    resolveId(id, importer) {
      if (id.startsWith('http')) {
        return id;
      }

      if (importer && importer.startsWith('http')) {
        const url = new URL(id, importer);
        return url.href;
      }

      return null;
    },
    async load(id) {
      if (id.startsWith('http')) {
        const rsp = await fetch(id);
        return rsp.text();
      }
      return null;
    },
    transform(code, id) {
      if (id.endsWith('.ts')) {
        const output = ts.transpileModule(code, {
          compilerOptions: {
            target: ts.ScriptTarget.ES2018,
            module: ts.ModuleKind.ESNext,
          },
        });
        return output.outputText;
      }
      return null;
    },
  };
}
