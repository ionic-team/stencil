import type * as d from '../../declarations';
import type { BundleOptions } from './bundle-interface';
import { getModule } from '../transpile/transpiled-module';
import { isString, normalizeFsPath } from '@utils';
import type { Plugin } from 'rollup';
import { tsResolveModuleName } from '../sys/typescript/typescript-resolve-module';
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
    },
  };
};

export const resolveIdWithTypeScript = (config: d.Config, compilerCtx: d.CompilerCtx): Plugin => {
  return {
    name: `resolveIdWithTypeScript`,

    async resolveId(importee, importer) {
      if (/\0/.test(importee) || !isString(importer)) {
        return null;
      }

      const tsResolved = tsResolveModuleName(config, compilerCtx, importee, importer);
      if (tsResolved && tsResolved.resolvedModule) {
        // this is probably a .d.ts file for whatever reason in how TS resolves this
        // use this resolved file as the "importer"
        const tsResolvedPath = tsResolved.resolvedModule.resolvedFileName;
        if (isString(tsResolvedPath) && !tsResolvedPath.endsWith('.d.ts')) {
          return tsResolvedPath;
        }
      }

      return null;
    },
  };
};
