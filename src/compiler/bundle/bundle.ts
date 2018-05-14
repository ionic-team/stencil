import { BuildCtx, CompilerCtx, Config, EntryModule, JSModuleMap } from '../../declarations';
import { catchError } from '../util';
import { generateBundleModules } from './bundle-modules';


export async function generateModuleMap(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]) {
  const timeSpan = config.logger.createTimeSpan(`module map started`);
  let jsModules: JSModuleMap;

  try {
    jsModules = await generateBundleModules(config, compilerCtx, buildCtx, entryModules);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`module map finished`);
  config.logger.debug(`module map finished`);

  return jsModules;
}
