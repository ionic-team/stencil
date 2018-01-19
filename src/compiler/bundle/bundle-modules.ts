import { BuildConfig, BuildContext, Bundle, JSModuleMap } from '../../util/interfaces';
import { catchError, hasError } from '../util';
import { writeEsModules, writeLegacyModules, createBundle, } from './rollup-bundle';


export async function bundleModules(config: BuildConfig, ctx: BuildContext, bundles: Bundle[]): Promise<JSModuleMap> {
  // create main module results object
  if (hasError(ctx.diagnostics)) {
    return {};
  }

  // do bundling if this is not a change build
  // or it's a change build that has either changed modules or components
  const doBundling = (!ctx.isChangeBuild || ctx.changeHasComponentModules || ctx.changeHasNonComponentModules);
  const timeSpan = config.logger.createTimeSpan(`bundle modules started`, !doBundling);

  let results: JSModuleMap = {};

  try {
    // run rollup, but don't generate yet
    // returned rollup bundle can be reused for es module and legacy
    const rollupBundle = await createBundle(config, ctx, bundles);

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

  timeSpan.finish('bundle modules finished');
  return results;
}
