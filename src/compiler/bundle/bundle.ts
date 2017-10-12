import { BuildConfig, BuildContext, Bundle, Diagnostic, ManifestBundle, ModuleFile } from '../../util/interfaces';
import { buildError, catchError, hasError } from '../util';
import { bundleModules } from './bundle-modules';
import { bundleStyles } from './bundle-styles';
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

  const manifestBundles = getManifestBundles(ctx.manifest.modulesFiles, ctx.manifest.bundles, ctx.diagnostics);

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
    const manifestBundle: ManifestBundle = {
      components: bundle.components.sort().slice(),
      moduleFiles: [],
      compiledModeStyles: [],
      compiledModuleText: '',
      priority: bundle.priority
    };

    manifestBundle.components.forEach(tag => {
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

  return manifestBundles.sort((a, b) => {
    if (a.components[0] < b.components[0]) return -1;
    if (a.components[0] > b.components[0]) return 1;
    return 0;
  });
}
