import { BuildContext, BuildConfig, ManifestBundle, ModuleFile } from '../../util/interfaces';
import { catchError, hasError } from '../util';
import { generateComponentStyles } from './component-styles';


export function bundleStyles(config: BuildConfig, ctx: BuildContext, manifestBundles: ManifestBundle[]) {
  // create main style results object
  if (hasError(ctx.diagnostics)) {
    return Promise.resolve();
  }

  // do bundling if this is not a change build
  // or it's a change build that has either changed sass or css
  const doBundling = (!ctx.isChangeBuild || ctx.changeHasCss || ctx.changeHasSass);

  const timeSpan = config.logger.createTimeSpan(`bundle styles started`, !doBundling);

  // go through each bundle the user wants created
  // and create css files for each mode for each bundle
  return Promise.all(manifestBundles.map(manifestBundle => {
    return generateBundleComponentStyles(config, ctx, manifestBundle);

  }))
  .catch(err => {
    catchError(ctx.diagnostics, err);

  })
  .then(() => {
    timeSpan.finish('bundle styles finished');
  });
}


function generateBundleComponentStyles(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle) {
  const bundleModes = getManifestBundleModes(manifestBundle.moduleFiles);

  const promises = manifestBundle. moduleFiles.filter(m => m.cmpMeta).map(moduleFile => {
    return generateComponentStyles(config, ctx, moduleFile, bundleModes).then(compiledModeStyles => {
      manifestBundle.compiledModeStyles.push(...compiledModeStyles);
    });
  });

  return Promise.all(promises);
}


export function getManifestBundleModes(bundleModuleFiles: ModuleFile[]) {
  const allBundleModes: string[] = [];

  bundleModuleFiles.filter(m => m.cmpMeta && m.cmpMeta.stylesMeta && Object.keys(m.cmpMeta.stylesMeta).length).forEach(moduleFile => {
    Object.keys(moduleFile.cmpMeta.stylesMeta).forEach(styleModeName => {
      if (!allBundleModes.includes(styleModeName)) {
        allBundleModes.push(styleModeName);
      }
    });
  });

  return allBundleModes.sort();
}

