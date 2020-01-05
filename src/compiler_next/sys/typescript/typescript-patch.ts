import * as d from '../../../declarations';
import { buildError, buildWarn, catchError, hasError, isString, loadTypeScriptDiagnostic, normalizePath } from '@utils';
import { patchTypeScriptSys, patchTypeScriptGetParsedCommandLineOfConfigFile } from './typescript-sys';
import { isAbsolute, join } from 'path';
import { loadTypescript } from './typescript-load';
import { patchTypeScriptResolveModule } from './typescript-resolve-module';
import ts from 'typescript';


export const patchTypescript = async (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => {
  // dynamically load the typescript dependency
  const loadedTs: typeof ts = await loadTypescript(diagnostics);
  if (hasError(diagnostics)) {
    return;
  }

  // override some properties on the original imported ts object
  patchTypeScriptSys(loadedTs, config, inMemoryFs);
  patchTypeScriptResolveModule(loadedTs, config, inMemoryFs);
  patchTypeScriptGetParsedCommandLineOfConfigFile(loadedTs, config);

  // assign the loaded ts object to our project's "ts" object
  // our "ts" object is the one the rest of the compiler imports and uses
  Object.assign(ts, loadedTs);

  config.tsconfig = await getTsConfigPath(config);

  await validateTsConfig(config, diagnostics);
};

export const getTsConfigPath = async (config: d.Config) => {
  if (config) {
    if (isString(config.tsconfig)) {
      if (!isAbsolute(config.tsconfig)) {
        return normalizePath(join(config.rootDir, config.tsconfig));
      }
      return normalizePath(config.tsconfig);
    }
    if (config.sys_next) {
      const tsConfigPath = join(config.rootDir, 'tsconfig.json');
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

const hasSrcDirectoryInclude = (includeProp: string[]) =>
  Array.isArray(includeProp) && includeProp.length > 0;

const hasStencilConfigInclude = (includeProp: string[]) =>
  Array.isArray(includeProp) && includeProp.includes('stencil.config.ts');
