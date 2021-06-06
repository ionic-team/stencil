import type { Plugin } from 'rollup';
import fs from 'fs-extra';
import fetch from 'node-fetch';
import ts from 'typescript';
import type { BuildOptions } from '../../utils/options';
import { join } from 'path';

export function denoStdPlugin(opts: BuildOptions): Plugin {
  const cacheDir = join(opts.scriptsBuildDir, 'deno-cache');
  fs.ensureDirSync(cacheDir);

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
        const cacheName = id.split('://')[1].replace(/:|\/|\.|@/g, '_') + '.ts';
        const cachePath = join(cacheDir, cacheName);
        try {
          const cachedContent = await fs.readFile(cachePath, 'utf8');
          return cachedContent;
        } catch (e) {}

        const rsp = await fetch(id);
        const fetchedContent = await rsp.text();

        await fs.writeFile(cachePath, fetchedContent);

        return fetchedContent;
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
