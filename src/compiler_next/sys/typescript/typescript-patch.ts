import * as d from '../../../declarations';
import { buildWarn, catchError, isString, loadTypeScriptDiagnostic, normalizePath } from '@utils';
import { getTypeScriptSys } from './typescript-sys';
import { loadTypescript } from './typescript-load';
import { patchTypeScriptResolveModule } from './typescript-resolve-module';
import path from 'path';
import ts from 'typescript';


export const patchTypescript = async (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => {
  const loadedTs = loadTypescript(diagnostics);

  Object.assign(ts, loadedTs);

  loadedTs.sys = ts.sys = getTypeScriptSys(config, inMemoryFs);

  loadedTs.resolveModuleName = ts.resolveModuleName = patchTypeScriptResolveModule(config, inMemoryFs);

  config.tsconfig = getTsConfigPath(config);

  await validateTsConfig(config, diagnostics, inMemoryFs);
};

const getTsConfigPath = (config: d.Config) => {
  if (isString(config.tsconfig)) {
    if (!path.isAbsolute(config.tsconfig)) {
      return normalizePath(path.join(config.rootDir, config.tsconfig));
    }
    return normalizePath(config.tsconfig);
  }
  return ts.findConfigFile(config.rootDir, ts.sys.fileExists);
};

const validateTsConfig = async (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => {
  try {
    const tsconfigContent = await inMemoryFs.readFile(config.tsconfig);

    const results = ts.parseConfigFileTextToJson(config.tsconfig, tsconfigContent);

    if (results.error) {
      diagnostics.push(loadTypeScriptDiagnostic(results.error));

    } else if (results.config) {
      if (!Array.isArray(results.config.include) || results.config.include.length === 0) {
        const warn = buildWarn(diagnostics);
        warn.header = `tsconfig.json "include" required`;
        warn.messageText = `In order for TypeScript to improve watch performance, it's recommended the "tsconfig.json" file should have the "include" property, with at least the app's "src" directory listed. For example: "include": ["src"]`;
      }
    }

  } catch (e) {
    catchError(diagnostics, e);
  }
};
