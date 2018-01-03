import { BuildConfig, BuildContext, ServiceWorkerConfig } from '../../util/interfaces';
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

  if (hasSrcConfig(config)) {
    copyLib(config, ctx);
    return injectManifest(config, ctx);
  } else {
    return generate(config, ctx);
  }
}

function copyLib(config: BuildConfig, ctx: BuildContext) {
  const timeSpan = config.logger.createTimeSpan(`copy service worker library started`);
  return config.sys.workbox.copyWorkboxLibraries(config.wwwDir)
    .catch(err => catchError(ctx.diagnostics, err))
    .then(() => timeSpan.finish(`copy service worker library finished`));
}

function generate(config: BuildConfig, ctx: BuildContext) {
  const timeSpan = config.logger.createTimeSpan(`generate service worker started`);
  return config.sys.workbox.generateSW(config.serviceWorker)
    .catch(err => catchError(ctx.diagnostics, err))
    .then(() => timeSpan.finish(`generate service worker finished`));
}

function injectManifest(config: BuildConfig, ctx: BuildContext) {
  const timeSpan = config.logger.createTimeSpan(`inject manifest into service worker started`);
  return config.sys.workbox.injectManifest(config.serviceWorker)
    .catch(err => catchError(ctx.diagnostics, err))
    .then(() => timeSpan.finish('inject manifest into service worker finished'));
}

function hasSrcConfig(config: BuildConfig) {
  const serviceWorkerConfig = config.serviceWorker as ServiceWorkerConfig;
  return !!serviceWorkerConfig.swSrc;
}

