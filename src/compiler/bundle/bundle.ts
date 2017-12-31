import { BuildConfig, BuildContext, Diagnostic, Bundle, ManifestBundle, ModuleFile } from '../../util/interfaces';
import { buildError, catchError, hasError } from '../util';
import { bundleModules } from './bundle-modules';
import { bundleStyles } from './bundle-styles';
import { ENCAPSULATION } from '../../util/constants';
import { upgradeDependentComponents } from '../upgrade-dependents/index';


export async function bundle(config: BuildConfig, ctx: BuildContext) {
  let bundles: Bundle[] = [];

  if (hasError(ctx.diagnostics)) {
    return bundles;
  }

  if (config.generateWWW) {
    config.logger.debug(`bundle, buildDir: ${config.buildDir}`);
  }

  if (config.generateDistribution) {
    config.logger.debug(`bundle, distDir: ${config.distDir}`);
  }

  const timeSpan = config.logger.createTimeSpan(`bundle started`, true);

  try {
    // get all of the bundles from the manifest bundles
    bundles = getBundlesFromManifest(ctx.manifest.modulesFiles, ctx.manifest.bundles, ctx.diagnostics);

    // check they're good to go
    bundles = validateBundleModules(bundles);

    // always consistently sort them
    bundles = sortBundles(bundles);

    // Look at all dependent components from outside collections and
    // upgrade the components to be compatible with this version if need be
    await upgradeDependentComponents(config, ctx, bundles);

  // kick off style and module bundling at the same time
    await Promise.all([
      bundleStyles(config, ctx, bundles),
      bundleModules(config, ctx, bundles)
    ]);

  } catch (e) {
    catchError(ctx.diagnostics, e);
  }

  timeSpan.finish(`bundle finished`);

  return bundles;
}


export function getBundlesFromManifest(moduleFiles: ModuleFile[], manifestBundles: ManifestBundle[], diagnostics: Diagnostic[]) {
  const bundles: Bundle[] = [];

  manifestBundles.filter(b => b.components && b.components.length).forEach(manifestBundle => {
    const bundle = createBundle([]);

    manifestBundle.components.forEach(tag => {
      const cmpMeta = moduleFiles.find(modulesFile => modulesFile.cmpMeta.tagNameMeta === tag);
      if (cmpMeta) {
        bundle.moduleFiles.push(cmpMeta);

      } else {
        buildError(diagnostics).messageText = `Component tag "${tag}" is defined in a bundle but no matching component was found within this app or its collections.`;
      }
    });

    if (bundle.moduleFiles.length > 0) {
      bundles.push(bundle);
    }
  });

  return bundles;
}


function validateBundleModules(bundles: Bundle[]) {
  // can't mix and match different types of encapsulation in the same bundle
  const validatedBundles: Bundle[] = [];

  bundles.forEach(bundle => {
    validateBundle(validatedBundles, bundle);
  });

  return validatedBundles;
}


export function validateBundle(validatedBundles: Bundle[], bundle: Bundle) {
  // ok, so this method is used to clean up the bundles to make sure that
  // all of the components in this bundle share the same encapsulation type
  // we could throw an error if the user mix and matches, but that's confusing
  // and they'd have to manually do what we're doing below. So let's just do it for them
  // so make sure each bundle has the same encapsulation type, and for those who
  // don't have the same type, then create new bundles which share the same type
  if (bundle.moduleFiles.length === 0) {
    // no components, no bundle (not sure how this could happen, but whatever)
    return;
  }

  if (bundle.moduleFiles.length === 1) {
    // only one component, so we couldn't have issues with
    // different encapsulation types in the bundle
    validatedBundles.push(bundle);
    return;
  }

  // there are multiple components in this bundle
  // figure out which encapsulation type we see the most of in this bundle
  const primaryEncapsulation = findPrimaryEncapsulation(bundle.moduleFiles);

  // used to collect all the same encapsulation type in this main bundle
  const primaryCss: ModuleFile[] = [];

  // used to collect all the types that shouldn't be grouped in this module
  const scopedCss: ModuleFile[] = [];
  const shadowCss: ModuleFile[] = [];
  const plainCss: ModuleFile[] = [];

  // pick out only
  bundle.moduleFiles.forEach(moduleFile => {
    const cmpMeta = moduleFile.cmpMeta;
    if (cmpMeta.encapsulation === primaryEncapsulation || !cmpMeta.stylesMeta) {
      // this component uses the same encapsulation type as everyone else
      // or it doesn't have styles at all so it doesn't matter
      primaryCss.push(moduleFile);

    } else if (moduleFile.cmpMeta.encapsulation === ENCAPSULATION.ScopedCss) {
      scopedCss.push(moduleFile);

    } else if (moduleFile.cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
      shadowCss.push(moduleFile);

    } else {
      plainCss.push(moduleFile);
    }
  });

  if (primaryCss.length) {
    bundle.moduleFiles = primaryCss;
    validatedBundles.push(bundle);
  }
  if (scopedCss.length) {
    validatedBundles.push(createBundle(scopedCss));
  }
  if (shadowCss.length) {
    validatedBundles.push(createBundle(shadowCss));
  }
  if (plainCss.length) {
    validatedBundles.push(createBundle(plainCss));
  }
}


export function findPrimaryEncapsulation(moduleFiles: ModuleFile[]) {
  const plainCssCmps = moduleFiles.filter(m => m.cmpMeta.encapsulation !== ENCAPSULATION.ScopedCss && m.cmpMeta.encapsulation !== ENCAPSULATION.ShadowDom);
  const scopedCssCmps = moduleFiles.filter(m => m.cmpMeta.encapsulation === ENCAPSULATION.ScopedCss);
  const shadowCssCmps = moduleFiles.filter(m => m.cmpMeta.encapsulation === ENCAPSULATION.ShadowDom);

  // figure out which encapsulation type we have the most of
  const sorted = [plainCssCmps, scopedCssCmps, shadowCssCmps].sort((a, b) => {
    if (a.length < b.length) return 1;
    if (a.length > b.length) return -1;
    return 0;
  });

  if (sorted.length && sorted[0].length) {
    return sorted[0][0].cmpMeta.encapsulation;
  }

  return null;
}


function createBundle(moduleFiles: ModuleFile[]) {
  const bundle: Bundle = {
    moduleFiles: moduleFiles,
    compiledModuleText: ''
  };
  return bundle;
}


export function sortBundles(bundles: Bundle[]) {
  bundles.forEach(m => {
    m.moduleFiles = m.moduleFiles.sort((a, b) => {
      if (a.cmpMeta.tagNameMeta < b.cmpMeta.tagNameMeta) return -1;
      if (a.cmpMeta.tagNameMeta > b.cmpMeta.tagNameMeta) return 1;
      return 0;
    });
  });

  return bundles.sort((a, b) => {
    if (a.moduleFiles[0].cmpMeta.tagNameMeta < b.moduleFiles[0].cmpMeta.tagNameMeta) return -1;
    if (a.moduleFiles[0].cmpMeta.tagNameMeta > b.moduleFiles[0].cmpMeta.tagNameMeta) return 1;
    return 0;
  });
}
