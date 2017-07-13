import { BuildConfig, BuildContext, BundleResults, Manifest } from '../interfaces';
import { bundleAssets } from '../component-plugins/assets-plugin';
import { bundleModules } from './bundle-modules';
import { bundleStyles } from './bundle-styles';
import { catchError } from '../util';
import { generateComponentRegistry } from './bundle-registry';


export function bundle(config: BuildConfig, ctx: BuildContext, manifest: Manifest) {
  const logger = config.logger;

  const bundleResults: BundleResults = {
    diagnostics: [],
    componentRegistry: []
  };

  logger.debug(`bundle, src: ${config.src}`);
  logger.debug(`bundle, buildDest: ${config.buildDest}`);

  return Promise.resolve().then(() => {
    // kick off style and module bundling at the same time
    return Promise.all([
      bundleStyles(config, ctx, manifest),
      bundleModules(config, ctx, manifest),
      bundleAssets(config, ctx, manifest)
    ]);

  }).then(results => {
    // both styles and modules are done bundling
    const styleResults = results[0];
    if (styleResults.diagnostics) {
      bundleResults.diagnostics = bundleResults.diagnostics.concat(styleResults.diagnostics);
    }

    const moduleResults = results[1];
    if (moduleResults.diagnostics && moduleResults.diagnostics.length) {
      bundleResults.diagnostics = bundleResults.diagnostics.concat(moduleResults.diagnostics);
    }

    const assetResults = results[2];
    if (assetResults.diagnostics && assetResults.diagnostics.length) {
      bundleResults.diagnostics = bundleResults.diagnostics.concat(assetResults.diagnostics);
    }

    bundleResults.componentRegistry = generateComponentRegistry(config, manifest, styleResults, moduleResults);

  }).catch(err => {
    catchError(bundleResults.diagnostics, err);

  })
  .then(() => {
    return bundleResults;
  });
}
