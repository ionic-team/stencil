import * as d from '../../../declarations';
import { normalizePath } from '@utils';
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
};


const getTsConfigPath = (config: d.Config) => {
  if (typeof config.tsconfig === 'string') {
    if (!path.isAbsolute(config.tsconfig)) {
      return normalizePath(path.join(config.rootDir, config.tsconfig));
    }
    return normalizePath(config.tsconfig);
  }

  return ts.findConfigFile(config.rootDir, ts.sys.fileExists);
};
