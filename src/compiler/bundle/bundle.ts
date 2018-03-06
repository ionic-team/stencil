import { BuildCtx, CompilerCtx, Config, EntryModule, JSModuleMap } from '../../declarations';
import { catchError } from '../util';
import { generateBundleModules } from './bundle-modules';


export async function bundle(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]) {
  if (config.outputTargets['www']) {
    config.logger.debug(`bundle, buildDir: ${config.outputTargets['www'].buildDir}`);
  }

  if (config.outputTargets['distribution']) {
    config.logger.debug(`bundle, distDir: ${config.outputTargets['distribution'].dir}`);
  }

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
