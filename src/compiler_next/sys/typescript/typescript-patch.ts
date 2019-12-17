import * as d from '../../../declarations';
import { buildError, buildWarn, catchError, isString, loadTypeScriptDiagnostic, normalizePath, hasError } from '@utils';
import { getTypeScriptSys } from './typescript-sys';
import { loadTypescript } from './typescript-load';
import { patchTypeScriptResolveModule } from './typescript-resolve-module';
import path from 'path';
import ts from 'typescript';


export const patchTypescript = async (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => {
  const loadedTs = loadTypescript(diagnostics);
  if (hasError(diagnostics)) {
    return;
  }

  Object.assign(ts, loadedTs);

  loadedTs.sys = ts.sys = getTypeScriptSys(config, inMemoryFs);

  loadedTs.resolveModuleName = ts.resolveModuleName = patchTypeScriptResolveModule(config, inMemoryFs);

  config.tsconfig = await getTsConfigPath(config);

  await validateTsConfig(config, diagnostics);
};

export const getTsConfigPath = async (config: d.Config) => {
  if (config) {
    if (isString(config.tsconfig)) {
      if (!path.isAbsolute(config.tsconfig)) {
        return normalizePath(path.join(config.rootDir, config.tsconfig));
      }
      return normalizePath(config.tsconfig);
    }
    if (config.sys_next) {
      const tsConfigPath = path.join(config.rootDir, 'tsconfig.json');
      const tsconfigStat = await config.sys_next.stat(tsConfigPath);
      if (tsconfigStat && tsconfigStat.isFile()) {
        return normalizePath(tsConfigPath);
      }
    }
  }
  return null;
};

const validateTsConfig = async (config: d.Config, diagnostics: d.Diagnostic[]) => {
  if (isString(config.tsconfig)) {
    try {
      const host: any = {
        ...ts.sys
      };
      const results = ts.getParsedCommandLineOfConfigFile(config.tsconfig, {}, host);

      if (results.errors && results.errors.length > 0) {
        results.errors.forEach(configErr => {
          diagnostics.push(loadTypeScriptDiagnostic(configErr));
        });

      } else {
        if (results.raw) {

          if (!hasSrcDirectoryInclude(results.raw.include)) {
            const warn = buildWarn(diagnostics);
            warn.header = `tsconfig.json "include" required`;
            warn.messageText = `In order for TypeScript to improve watch performance, it's recommended the "tsconfig.json" file should have the "include" property, with at least the app's "src" directory listed. For example: "include": ["src"]`;
          }

          if (hasStencilConfigInclude(results.raw.include)) {
            const warn = buildWarn(diagnostics);
            warn.header = `tsconfig.json should not reference stencil.config.ts`;
            warn.messageText = `stencil.config.ts is not part of the output build, it should not be included.`;
          }
        }

        if (results.options) {
          const compilerOptions = results.options;

          const target = (compilerOptions.target ?? ts.ScriptTarget.ES5);
          if ([ts.ScriptTarget.ES3, ts.ScriptTarget.ES5, ts.ScriptTarget.ES2015, ts.ScriptTarget.ES2016].includes(target)) {
            const warn = buildWarn(diagnostics);
            warn.messageText = `To improve bundling, it is always recommended to set the tsconfig.json “target” setting to "es2017". Note that the compiler will automatically handle transpilation for ES5-only browsers.`;
          }

          if (compilerOptions.module !== ts.ModuleKind.ESNext && !config._isTesting) {
            const warn = buildWarn(diagnostics);
            warn.messageText = `To improve bundling, it is always recommended to set the tsconfig.json “module” setting to “esnext”. Note that the compiler will automatically handle bundling both modern and legacy builds.`;
          }
        }
      }

    } catch (e) {
      catchError(diagnostics, e);
    }

  } else {
    const diagnostic = buildError(diagnostics);
    diagnostic.header = `Missing tsconfig.json`;
    diagnostic.messageText = `Unable to load TypeScript config file. Please create a "tsconfig.json" file within the "${config.rootDir}" directory.`;
  }
};

const hasSrcDirectoryInclude = (includeProp: string[]) => {
  return includeProp && includeProp.includes('src');
};

const hasStencilConfigInclude = (includeProp: string[]) => {
  return includeProp && includeProp.includes('stencil.config.ts');
};
