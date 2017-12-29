import { BuildContext, BuildConfig, ManifestBundle, ModuleFile } from '../../util/interfaces';
import { catchError, hasError } from '../util';
import { ENCAPSULATION } from '../../util/constants';
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
    return bundleComponentStyles(config, ctx, manifestBundle);

  }))
  .catch(err => {
    catchError(ctx.diagnostics, err);

  })
  .then(() => {
    timeSpan.finish('bundle styles finished');
  });
}


function bundleComponentStyles(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle) {
  return Promise.all(manifestBundle.moduleFiles.filter(m => m.cmpMeta).map(moduleFile => {
    return generateComponentStyles(config, ctx, moduleFile);
  }));
}


export function getManifestBundleModes(bundleModuleFiles: ModuleFile[]) {
  const allBundleModes: string[] = [];

  bundleModuleFiles.filter(m => m.cmpMeta && m.cmpMeta.stylesMeta).forEach(moduleFile => {
    Object.keys(moduleFile.cmpMeta.stylesMeta).forEach(styleModeName => {
      if (!allBundleModes.includes(styleModeName)) {
        allBundleModes.push(styleModeName);
      }
    });
  });

  return allBundleModes.sort();
}


export function componentRequiresScopedStyles(encapsulation: ENCAPSULATION) {
  return (encapsulation === ENCAPSULATION.ScopedCss || encapsulation === ENCAPSULATION.ShadowDom);
}


export function bundleRequiresScopedStyles(moduleFiles: ModuleFile[]) {
  return moduleFiles
          .filter(m => m.cmpMeta && m.cmpMeta.stylesMeta)
          .some(m => componentRequiresScopedStyles(m.cmpMeta.encapsulation));
}
