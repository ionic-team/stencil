import { BuildCtx, CompilerCtx, Config, EntryModule, JSModuleMap } from '../../declarations';
import { catchError } from '../util';
import { createBundle, writeEsModules, writeLegacyModules  } from './rollup-bundle';


export async function generateBundleModules(config: Config, contextCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]): Promise<JSModuleMap> {

  const results: JSModuleMap = {};

  try {
    // run rollup, but don't generate yet
    // returned rollup bundle can be reused for es module and legacy
    const rollupBundle = await createBundle(config, contextCtx, buildCtx, entryModules);

    // bundle using only es modules and dynamic imports
    results.esm = await writeEsModules(config, rollupBundle);

    buildCtx.bundleBuildCount = Object.keys(results.esm).length;

    if (config.buildEs5) {
      // only create legacy modules when generating es5 fallbacks
      // bundle using commonjs using jsonp callback
      results.es5 = await writeLegacyModules(config, rollupBundle, entryModules);
    }

  } catch (err) {
    catchError(buildCtx.diagnostics, err);
  }

  return results;
}
