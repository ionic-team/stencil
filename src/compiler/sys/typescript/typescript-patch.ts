import type * as d from '../../../declarations';
import { exit, getCurrentDirectory, hasError, isBoolean, noop } from '@utils';
import { loadTypescript } from './typescript-load';
import { patchTypeScriptResolveModule } from './typescript-resolve-module';
import { patchTypeScriptSys, patchTypeScriptGetParsedCommandLineOfConfigFile } from './typescript-sys';
import { resolve } from 'path';
import ts from 'typescript';

export const patchTypescript = async (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => {
  // dynamically load the typescript dependency
  const loadedTs = await loadTypescript(config.sys, config.typescriptPath, false);
  patchTypescriptModule(config, diagnostics, inMemoryFs, loadedTs);
};

export const patchTypescriptSync = (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => {
  const loadedTs = loadTypescript(config.sys, config.typescriptPath, true) as typeof ts;
  patchTypescriptModule(config, diagnostics, inMemoryFs, loadedTs);
};

const patchTypescriptModule = async (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem, loadedTs: typeof ts) => {
  if (loadedTs && !hasError(diagnostics)) {
    // override some properties on the original imported ts object
    patchTypeScriptSys(loadedTs, config, inMemoryFs);
    patchTypeScriptResolveModule(loadedTs, config, inMemoryFs);
    patchTypeScriptGetParsedCommandLineOfConfigFile(loadedTs);

    // the ts object you see imported here is actually a bogus {} object right now
    // so assign the loaded ts object to our project's imported "ts" object
    // our "ts" object is the one the rest of the compiler imports and uses
    Object.assign(ts, loadedTs);
  }
};

export const patchRemoteTsSys = (loadedTs: typeof ts, tsUrl: string) => {
  // patches just the bare minimum
  const tsSys: ts.System = (loadedTs.sys = loadedTs.sys || ({} as any));
  tsSys.getExecutingFilePath = () => tsUrl;

  if (!tsSys.getCurrentDirectory) {
    tsSys.getCurrentDirectory = getCurrentDirectory;
  }
  if (!tsSys.exit) {
    tsSys.exit = exit;
  }
  if (!tsSys.args) {
    tsSys.args = [];
  }
  if (!tsSys.newLine) {
    tsSys.newLine = '\n';
  }
  if (!isBoolean(tsSys.useCaseSensitiveFileNames)) {
    tsSys.useCaseSensitiveFileNames = false;
  }
  if (!tsSys.resolvePath) {
    tsSys.resolvePath = resolve;
  }
  if (!tsSys.write) {
    tsSys.write = noop;
  }
};
