import { BuildConfig, BuildContext } from '../../util/interfaces';
import { catchError } from '../util';


export function generateServiceWorker(config: BuildConfig, ctx: BuildContext) {
  if (!ctx.hasIndexHtml || !config.generateWWW) {
    config.logger.debug(`generateServiceWorker, no index.html, so skipping sw build`);
    return Promise.resolve();
  }

  if (!config.serviceWorker) {
    // no sw config, let's not continue
    return Promise.resolve();
  }

  const timeSpan = config.logger.createTimeSpan(`generate service worker started`);

  // cool let's do this
  // kick off the async workbox service worker generation
  return config.sys.workbox.generateSW(config.serviceWorker)
    .catch(err => {
      catchError(ctx.diagnostics, err);

    }).then(() => {
      timeSpan.finish(`generate service worker finished`);
    });
}
