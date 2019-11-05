import { BundleOptions } from './bundle-interface';
import { CompilerCtx } from '../../declarations';
import { getModule } from '../transpile/static-to-meta/parse-static';
import { normalizeFsPath } from '@utils';
import { Plugin } from 'rollup';
import path from 'path';
import ts from 'typescript';


export const typescriptPlugin = (compilerCtx: CompilerCtx, bundleOpts: BundleOptions): Plugin => {
  const tsPrinter = ts.createPrinter();

  return {
    name: `${bundleOpts.id}TypescriptPlugin`,

    load(id) {
      const fsFilePath = normalizeFsPath(id);
      const ext = path.extname(fsFilePath);
      if (!TS_TRANSPILE_EXTS.has(ext)) {
        return null;
      }

      const mod = getModule(compilerCtx, fsFilePath);
      if (mod) {
        if (mod.cmps.length === 0) {
          return mod.staticSourceFileText;

        } else {
          const transformed = ts.transform(mod.staticSourceFile, bundleOpts.customTransformers).transformed[0];
          return tsPrinter.printFile(transformed);
        }
      }

      return null;
    }
  };
};

const TS_TRANSPILE_EXTS = new Set(['.tsx', '.ts', '.jsx']);
