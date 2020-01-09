import * as d from '../../../declarations';
import { hasError } from '@utils';
import { patchTypeScriptSys, patchTypeScriptGetParsedCommandLineOfConfigFile } from './typescript-sys';
import { loadTypescript } from './typescript-load';
import { patchTypeScriptResolveModule } from './typescript-resolve-module';
import ts from 'typescript';


export const patchTypescript = async (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => {
  // dynamically load the typescript dependency
  const loadedTs = await loadTypescript(diagnostics);
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
};
