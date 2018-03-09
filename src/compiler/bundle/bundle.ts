import { BuildCtx, CompilerCtx, Config, EntryModule, JSModuleMap } from '../../declarations';
import { catchError } from '../util';
import { generateBundleModules } from './bundle-modules';


export async function bundle(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]) {
  const timeSpan = config.logger.createTimeSpan(`bundle started`, true);
  let jsModules: JSModuleMap;

  try {
    // kick off style and module bundling at the same time
    jsModules = await generateBundleModules(config, compilerCtx, buildCtx, entryModules);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`bundling finished`);

  return jsModules;
}
