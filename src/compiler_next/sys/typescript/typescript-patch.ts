import * as d from '../../../declarations';
import { hasError } from '@utils';
import { patchTypeScriptSys, patchTypeScriptGetParsedCommandLineOfConfigFile } from './typescript-sys';
import { loadTypescript, loadTypescriptSync, TypeScriptModule } from './typescript-load';
import { patchTypeScriptResolveModule } from './typescript-resolve-module';
import ts from 'typescript';


export const patchTypescript = async (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => {
  // dynamically load the typescript dependency
  const loadedTs = await loadTypescript(diagnostics, config.typescriptPath);
  patchTypescriptModule(config, diagnostics, inMemoryFs, loadedTs);
};

export const patchTypescriptSync = (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => {
  const loadedTs = loadTypescriptSync(diagnostics, config.typescriptPath);
  patchTypescriptModule(config, diagnostics, inMemoryFs, loadedTs);
};

const patchTypescriptModule = async (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem, loadedTs: TypeScriptModule) => {
  if (loadedTs && !hasError(diagnostics)) {
    // override some properties on the original imported ts object
    patchTypeScriptSys(loadedTs, config, inMemoryFs);
    patchTypeScriptResolveModule(loadedTs, config, inMemoryFs);
    patchTypeScriptGetParsedCommandLineOfConfigFile(loadedTs, config);

    // the ts object you see imported here is actually a bogus {} object right now
    // so assign the loaded ts object to our project's imported "ts" object
    // our "ts" object is the one the rest of the compiler imports and uses
    Object.assign(ts, loadedTs);
  }
};
