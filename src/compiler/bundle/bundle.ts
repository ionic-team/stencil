import { BuildConfig, BuildContext } from '../../util/interfaces';
import { bundleModules } from './bundle-modules';
import { bundleStyles } from './bundle-styles';
import { catchError, hasError } from '../util';
import { generateComponentRegistry } from './bundle-registry';


export function bundle(config: BuildConfig, ctx: BuildContext) {
  if (hasError(ctx.diagnostics)) {
    return Promise.resolve();
  }

  const logger = config.logger;

  logger.debug(`bundle, src: ${config.src}`);
  logger.debug(`bundle, buildDest: ${config.buildDir}`);

  return Promise.resolve().then(() => {
    // kick off style and module bundling at the same time
    return Promise.all([
      bundleStyles(config, ctx),
      bundleModules(config, ctx)
    ]);

  }).then(results => {
    // both styles and modules are done bundling
    const styleResults = results[0];
    const moduleResults = results[1];

    ctx.registry = generateComponentRegistry(ctx.manifest, styleResults, moduleResults);

  }).catch(err => {
    catchError(ctx.diagnostics, err);

  });
}
