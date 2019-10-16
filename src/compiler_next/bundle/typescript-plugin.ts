import { BundleOptions } from './bundle-interface';
import { Plugin } from 'rollup';
import ts from 'typescript';
import { CompilerCtx } from '../../declarations';
import { getModule } from '../transpile/static-to-meta/parse-static';

export const typescriptPlugin = (compilerCtx: CompilerCtx, bundleOpts: BundleOptions): Plugin => {
  const printer = ts.createPrinter();
  return {
    name: `${bundleOpts.id}TypescriptPlugin`,

    load(id) {
      if (!id.endsWith('.tsx') && !id.endsWith('.ts')) {
        return null;
      }
      // implement our own cache
      const mod = getModule(compilerCtx, id);
      if (mod) {
        if (mod.cmps.length === 0) {
          return mod.staticSourceFileText;
        } else {
          const transformed = ts.transform(mod.staticSourceFile, bundleOpts.customTransformers).transformed[0];
          return printer.printFile(transformed);
        }
      }
      return null;
    }
  };
};
