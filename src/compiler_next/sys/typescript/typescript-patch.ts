import * as d from '../../../declarations';
import { buildError, buildWarn, catchError, isString, loadTypeScriptDiagnostic, normalizePath } from '@utils';
import { getTypeScriptSys } from './typescript-sys';
import { loadTypescript } from './typescript-load';
import { patchTypeScriptResolveModule } from './typescript-resolve-module';
import path from 'path';
import ts from 'typescript';


export const patchTypescript = async (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => {
  const loadedTs = loadTypescript(diagnostics);
  if (diagnostics.length > 0) {
    return;
  }

  Object.assign(ts, loadedTs);

  loadedTs.sys = ts.sys = getTypeScriptSys(config, inMemoryFs);

  loadedTs.resolveModuleName = ts.resolveModuleName = patchTypeScriptResolveModule(config, inMemoryFs);

  config.tsconfig = await getTsConfigPath(config);

  await validateTsConfig(config, diagnostics, inMemoryFs);
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

const validateTsConfig = async (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => {
  if (isString(config.tsconfig)) {
    try {
      const tsconfigContent = await inMemoryFs.readFile(config.tsconfig);

      const results = ts.parseConfigFileTextToJson(config.tsconfig, tsconfigContent);

      if (results.error) {
        diagnostics.push(loadTypeScriptDiagnostic(results.error));

      } else if (results.config) {
        if (hasSrcDirectoryInclude(results.config.include)) {
          const warn = buildWarn(diagnostics);
          warn.header = `tsconfig.json "include" required`;
          warn.messageText = `In order for TypeScript to improve watch performance, it's recommended the "tsconfig.json" file should have the "include" property, with at least the app's "src" directory listed. For example: "include": ["src"]`;
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
  return !Array.isArray(includeProp) || includeProp.length === 0;
};
