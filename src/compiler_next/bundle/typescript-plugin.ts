import * as d from '../../declarations';
import { BundleOptions } from './bundle-interface';
import { getModule } from '../transpile/transpiled-module';
import { normalizeFsPath } from '@utils';
import { Plugin } from 'rollup';
import { isAbsolute } from 'path';
import ts from 'typescript';


export const typescriptPlugin = (compilerCtx: d.CompilerCtx, bundleOpts: BundleOptions): Plugin => {
  const tsPrinter = ts.createPrinter();

  return {
    name: `${bundleOpts.id}TypescriptPlugin`,

    load(id) {
      if (isAbsolute(id)) {
        const fsFilePath = normalizeFsPath(id);
        const mod = getModule(compilerCtx, fsFilePath);
        if (mod) {
          return mod.staticSourceFileText;
        }
      }
      return null;
    },
    transform(_, id) {
      if (isAbsolute(id)) {
        const fsFilePath = normalizeFsPath(id);
        const mod = getModule(compilerCtx, fsFilePath);
        if (mod && mod.cmps.length > 0) {
          const transformed = ts.transform(mod.staticSourceFile, bundleOpts.customTransformers).transformed[0];
          return tsPrinter.printFile(transformed);
        }
      }
      return null;
    }
  };
};
