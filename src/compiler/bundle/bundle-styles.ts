import { BuildContext, BuildConfig, Bundle } from '../../util/interfaces';
import { catchError, hasError } from '../util';
import { generateComponentStyles } from './component-styles';


export async function bundleStyles(config: BuildConfig, ctx: BuildContext, bundles: Bundle[]) {
  // create main style results object
  if (hasError(ctx.diagnostics)) {
    return;
  }

  // do bundling if this is not a change build
  // or it's a change build that has either changed sass or css
  const doBundling = (!ctx.isChangeBuild || ctx.changeHasCss || ctx.changeHasSass);

  const timeSpan = config.logger.createTimeSpan(`bundle styles started`, !doBundling);

  try {
    // go through each bundle the user wants created
    // and create css files for each mode for each bundle
    await Promise.all(bundles.map(bundle => {
      return bundleComponentStyles(config, ctx, bundle);
    }));

  } catch (e) {
    catchError(ctx.diagnostics, e);
  }

  timeSpan.finish('bundle styles finished');
}


function bundleComponentStyles(config: BuildConfig, ctx: BuildContext, bundles: Bundle) {
  return Promise.all(bundles.moduleFiles.filter(m => m.cmpMeta).map(moduleFile => {
    return generateComponentStyles(config, ctx, moduleFile);
  }));
}
