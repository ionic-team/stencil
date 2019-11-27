import { BundleOptions } from './bundle-interface';
import { CompilerCtx } from '../../declarations';
import { getModule } from '../transpile/static-to-meta/parse-static';
import { normalizeFsPath } from '@utils';
import { Plugin } from 'rollup';
import ts from 'typescript';


export const typescriptPlugin = (compilerCtx: CompilerCtx, bundleOpts: BundleOptions): Plugin => {
  const tsPrinter = ts.createPrinter();

  return {
    name: `${bundleOpts.id}TypescriptPlugin`,

    load(id) {
      const fsFilePath = normalizeFsPath(id);
      const mod = getModule(compilerCtx, fsFilePath);
      if (mod) {
        return mod.staticSourceFileText;
      }
      return null;
    },
    transform(_, id) {
      const mod = getModule(compilerCtx, id);
      if (mod && mod.cmps.length > 0) {
        const transformed = ts.transform(mod.staticSourceFile, bundleOpts.customTransformers).transformed[0];
        return tsPrinter.printFile(transformed);
      }
      return null;
    }
  };
};
