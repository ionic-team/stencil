import { BuildConfig, BuildContext, ManifestBundle } from '../../util/interfaces';
import { catchError, hasError } from '../util';
import { generateComponentModules } from './component-modules';


export function bundleModules(config: BuildConfig, ctx: BuildContext, manifestBundles: ManifestBundle[]) {
  // create main module results object
  if (hasError(ctx.diagnostics)) {
    return Promise.resolve();
  }

  // do bundling if this is not a change build
  // or it's a change build that has either changed modules or components
  const doBundling = (!ctx.isChangeBuild || ctx.changeHasComponentModules || ctx.changeHasNonComponentModules);

  const timeSpan = config.logger.createTimeSpan(`bundle modules started`, !doBundling);

  return Promise.all(manifestBundles.map(manifestBundle => {
    return generateComponentModules(config, ctx, manifestBundle);

  })).catch(err => {
    catchError(ctx.diagnostics, err);

  }).then(() => {
    timeSpan.finish('bundle modules finished');
  });
}
