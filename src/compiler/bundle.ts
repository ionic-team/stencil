import { BuildConfig, BuildContext, BundleResults, BundlerConfig } from './interfaces';
import { bundleModules } from './bundle-modules';
import { bundleStyles } from './bundle-styles';
import { bundleAssets } from './component-plugins/assets-plugin';
import { catchError } from './util';
import { generateComponentRegistry } from './bundle-registry';
import { validateBundlerConfig } from './validation';


export function bundle(buildConfig: BuildConfig, ctx: BuildContext, bundlerConfig: BundlerConfig) {
  const logger = buildConfig.logger;

  const bundleResults: BundleResults = {
    diagnostics: [],
    componentRegistry: []
  };

  logger.debug(`bundle, src: ${buildConfig.src}`);
  logger.debug(`bundle, buildDest: ${buildConfig.buildDest}`);

  return Promise.resolve().then(() => {
    validateBundlerConfig(bundlerConfig);

    // kick off style and module bundling at the same time
    return Promise.all([
      bundleStyles(buildConfig, ctx, bundlerConfig.manifest),
      bundleModules(buildConfig, ctx, bundlerConfig.manifest),
      bundleAssets(buildConfig, ctx, bundlerConfig.manifest)
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

    bundleResults.componentRegistry = generateComponentRegistry(bundlerConfig, styleResults, moduleResults);

  }).catch(err => {
    catchError(bundleResults.diagnostics, err);

  })
  .then(() => {
    return bundleResults;
  });
}
