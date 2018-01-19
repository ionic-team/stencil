import { BuildCtx, Bundle, CompilerCtx, Config, Diagnostic, ManifestBundle, ModuleFile } from '../../util/interfaces';
import { buildError, catchError } from '../util';
import { bundleRequiresScopedStyles, getBundleEncapsulations, getBundleModes, sortBundles } from './bundle-utils';
import { generateBundleModule } from './bundle-module';
import { upgradeDependentComponents } from '../upgrade-dependents/index';


export async function bundleModules(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  let bundles: Bundle[] = [];

  if (config.generateWWW) {
    config.logger.debug(`bundle, buildDir: ${config.buildDir}`);
  }

  if (config.generateDistribution) {
    config.logger.debug(`bundle, distDir: ${config.distDir}`);
  }

  const timeSpan = config.logger.createTimeSpan(`bundling started`, true);

  try {
    // get all of the bundles from the manifest bundles
    bundles = getBundlesFromManifest(
      buildCtx.manifest.modulesFiles,
      buildCtx.manifest.bundles,
      buildCtx.diagnostics
    );

    // Look at all dependent components from outside collections and
    // upgrade the components to be compatible with this version if need be
    await upgradeDependentComponents(config, compilerCtx, buildCtx, bundles);

    // kick off bundling
    await Promise.all(bundles.map(async bundle => {
      await generateBundleModule(config, compilerCtx, buildCtx, bundle);
    }));

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`bundling finished`);

  return bundles;
}


export function getBundlesFromManifest(moduleFiles: ModuleFile[], manifestBundles: ManifestBundle[], diagnostics: Diagnostic[]) {
  const bundles: Bundle[] = [];

  manifestBundles.filter(b => b.components && b.components.length).forEach(manifestBundle => {
    const bundle: Bundle = {
      moduleFiles: [],
      compiledModuleJsText: ''
    };

    manifestBundle.components.forEach(tag => {
      const cmpMeta = moduleFiles.find(modulesFile => modulesFile.cmpMeta.tagNameMeta === tag);
      if (cmpMeta) {
        bundle.moduleFiles.push(cmpMeta);

      } else {
        buildError(diagnostics).messageText = `Component tag "${tag}" is defined in a bundle but no matching component was found within this app or collections.`;
      }
    });

    if (bundle.moduleFiles.length > 0) {
      updateBundleData(bundle);
      bundles.push(bundle);
    }
  });

  // always consistently sort them
  return sortBundles(bundles);
}


export function updateBundleData(bundle: Bundle) {
  // generate a unique entry key based on the components within this bundle
  bundle.entryKey = 'bundle:' + bundle.moduleFiles.map(m => m.cmpMeta.tagNameMeta).sort().join('.');

  // get the modes used in this bundle
  bundle.modeNames = getBundleModes(bundle.moduleFiles);

  // get the encapsulations used in this bundle
  const encapsulations = getBundleEncapsulations(bundle);

  // figure out if we'll need an unscoped css build
  bundle.requiresScopedStyles = bundleRequiresScopedStyles(encapsulations);

  // figure out if we'll need a scoped css build
  bundle.requiresScopedStyles = bundleRequiresScopedStyles(encapsulations);
}
