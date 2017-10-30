import { BuildConfig, BuildContext, Bundle, Diagnostic, ManifestBundle, ModuleFile } from '../../util/interfaces';
import { buildError, catchError, hasError } from '../util';
import { bundleModules } from './bundle-modules';
import { bundleStyles } from './bundle-styles';
import { ENCAPSULATION, PRIORITY } from '../../util/constants';
import { generateBundles } from './generate-bundles';


export function bundle(config: BuildConfig, ctx: BuildContext) {
  if (hasError(ctx.diagnostics)) {
    return Promise.resolve();
  }

  const logger = config.logger;

  if (config.generateWWW) {
    logger.debug(`bundle, buildDir: ${config.buildDir}`);
  }

  if (config.generateDistribution) {
    logger.debug(`bundle, distDir: ${config.distDir}`);
  }

  let manifestBundles = getManifestBundles(ctx.manifest.modulesFiles, ctx.manifest.bundles, ctx.diagnostics);

  manifestBundles = validateBundleModules(manifestBundles);

  manifestBundles = sortBundles(manifestBundles);

  // kick off style and module bundling at the same time
  return Promise.all([
    bundleStyles(config, ctx, manifestBundles),
    bundleModules(config, ctx, manifestBundles)

  ]).then(() => {
    // both styles and modules are done bundling
    // generate the actual files to write
    generateBundles(config, ctx, manifestBundles);

  }).catch(err => {
    catchError(ctx.diagnostics, err);
  });
}


export function getManifestBundles(moduleFiles: ModuleFile[], bundles: Bundle[], diagnostics: Diagnostic[]) {
  const manifestBundles: ManifestBundle[] = [];

  bundles.filter(b => b.components && b.components.length).forEach(bundle => {
    const manifestBundle = createManifestBundle([], bundle.priority);

    bundle.components.forEach(tag => {
      const cmpMeta = moduleFiles.find(modulesFile => modulesFile.cmpMeta.tagNameMeta === tag);
      if (cmpMeta) {
        manifestBundle.moduleFiles.push(cmpMeta);

      } else {
        buildError(diagnostics).messageText = `Component tag "${tag}" is defined in a bundle but no matching component was found within this app or its collections.`;
      }
    });

    if (manifestBundle.moduleFiles.length > 0) {
      manifestBundles.push(manifestBundle);
    }
  });

  return manifestBundles;
}


function validateBundleModules(manifestBundles: ManifestBundle[]) {
  // can't mix and match different types of encapsulation in the same bundle
  const validatedBundles: ManifestBundle[] = [];

  manifestBundles.forEach(manifestBundle => {
    validateManifestBundle(validatedBundles, manifestBundle);
  });

  return validatedBundles;
}

export function validateManifestBundle(validatedBundles: ManifestBundle[], manifestBundle: ManifestBundle) {
  // ok, so this method is used to clean up the bundles to make sure that
  // all of the components in this bundle share the same encapsulation type
  // we could throw an error if the user mix and matches, but that's confusing
  // and they'd have to manually do what we're doing below. So let's just do it for them
  // so make sure each bundle has the same encapsulation type, and for those who
  // don't have the same type, then create new bundles which share the same type
  if (manifestBundle.moduleFiles.length === 0) {
    // no components, no bundle (not sure how this could happen, but whatever)
    return;
  }

  if (manifestBundle.moduleFiles.length === 1) {
    // only one component, so we couldn't have issues with
    // different encapsulation types in the bundle
    validatedBundles.push(manifestBundle);
    return;
  }

  // there are multiple components in this bundle
  // figure out which encapsulation type we see the most of in this bundle
  const primaryEncapsulation = findPrimaryEncapsulation(manifestBundle.moduleFiles);

  // used to collect all the same encapsulation type in this main bundle
  const primaryCss: ModuleFile[] = [];

  // used to collect all the types that shouldn't be grouped in this module
  const scopedCss: ModuleFile[] = [];
  const shadowCss: ModuleFile[] = [];
  const plainCss: ModuleFile[] = [];

  // pick out only
  manifestBundle.moduleFiles.forEach(moduleFile => {
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
    manifestBundle.moduleFiles = primaryCss;
    validatedBundles.push(manifestBundle);
  }
  if (scopedCss.length) {
    validatedBundles.push(createManifestBundle(scopedCss, manifestBundle.priority));
  }
  if (shadowCss.length) {
    validatedBundles.push(createManifestBundle(shadowCss, manifestBundle.priority));
  }
  if (plainCss.length) {
    validatedBundles.push(createManifestBundle(plainCss, manifestBundle.priority));
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


function createManifestBundle(moduleFiles: ModuleFile[], priority: PRIORITY) {
  const manifestBundle: ManifestBundle = {
    moduleFiles: moduleFiles,
    compiledModeStyles: [],
    compiledModuleText: '',
    priority: priority
  };
  return manifestBundle;
}


export function sortBundles(manifestBundles: ManifestBundle[]) {
  manifestBundles.forEach(m => {
    m.moduleFiles = m.moduleFiles.sort((a, b) => {
      if (a.cmpMeta.tagNameMeta < b.cmpMeta.tagNameMeta) return -1;
      if (a.cmpMeta.tagNameMeta > b.cmpMeta.tagNameMeta) return 1;
      return 0;
    });
  });

  return manifestBundles.sort((a, b) => {
    if (a.moduleFiles[0].cmpMeta.tagNameMeta < b.moduleFiles[0].cmpMeta.tagNameMeta) return -1;
    if (a.moduleFiles[0].cmpMeta.tagNameMeta > b.moduleFiles[0].cmpMeta.tagNameMeta) return 1;
    return 0;
  });
}
