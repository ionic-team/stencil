import type * as d from '../../declarations';
import type { BundleOptions } from './bundle-interface';
import { getModule } from '../transpile/transpiled-module';
import { isString, normalizeFsPath } from '@utils';
import type { Plugin } from 'rollup';
import { tsResolveModuleName } from '../sys/typescript/typescript-resolve-module';
import { isAbsolute, basename } from 'path';
import ts from 'typescript';

export const typescriptPlugin = (compilerCtx: d.CompilerCtx, bundleOpts: BundleOptions, config: d.Config): Plugin => {
  return {
    name: `${bundleOpts.id}TypescriptPlugin`,

    load(id): d.RollupLoadHook {
      if (isAbsolute(id)) {
        const fsFilePath = normalizeFsPath(id);
        const module = getModule(compilerCtx, fsFilePath);

        if (module) {
          if (!module.sourceMapFileText) {
            return { code: module.staticSourceFileText, map: null };
          }

          const sourceMap: d.SourceMap = JSON.parse(module.sourceMapFileText);
          sourceMap.sources = sourceMap.sources.map((src) => basename(src));
          return { code: module.staticSourceFileText, map: sourceMap };
        }
      }
      return null;
    },
    transform(_, id): d.RollupTransformHook {
      if (isAbsolute(id)) {
        const fsFilePath = normalizeFsPath(id);
        const mod = getModule(compilerCtx, fsFilePath);
        if (mod && mod.cmps.length > 0) {
          const tsResult = ts.transpileModule(mod.staticSourceFileText, {
            compilerOptions: config.tsCompilerOptions,
            fileName: mod.sourceFilePath,
            transformers: { before: bundleOpts.customTransformers },
          });
          const sourceMap: d.SourceMap = tsResult.sourceMapText ? JSON.parse(tsResult.sourceMapText) : null;
          return { code: tsResult.outputText, map: sourceMap };
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
