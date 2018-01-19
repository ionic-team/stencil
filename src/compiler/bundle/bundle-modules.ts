import { Config, BuildCtx, CompilerCtx, Bundle, JSModuleMap } from '../../util/interfaces';
import { catchError } from '../util';
import { writeEsModules, writeLegacyModules, createBundle, } from './rollup-bundle';


export async function generateBundleModule(config: Config, contextCtx: CompilerCtx, ctx: BuildCtx, bundles: Bundle[]): Promise<JSModuleMap> {

  let results: JSModuleMap = {};

  try {
    // run rollup, but don't generate yet
    // returned rollup bundle can be reused for es module and legacy
    const rollupBundle = await createBundle(config, contextCtx, ctx, bundles);

    // bundle using only es modules and dynamic imports
    results.esm = await writeEsModules(config, rollupBundle);

    if (config.buildEs5) {
      // only create legacy modules when generating es5 fallbacks
      // bundle using commonjs using jsonp callback
      results.es5 = await writeLegacyModules(config, rollupBundle, bundles);
    }

  } catch (err) {
    catchError(ctx.diagnostics, err);
  }

  return results;
}
