import { BuildConfig, BuildContext, ServiceWorkerConfig } from '../../util/interfaces';
import { catchError } from '../util';


export async function generateServiceWorker(config: BuildConfig, ctx: BuildContext) {
  if (!ctx.hasIndexHtml || !config.generateWWW) {
    config.logger.debug(`generateServiceWorker, no index.html, so skipping sw build`);
    return;
  }

  if (!config.serviceWorker) {
    // no sw config, let's not continue
    return;
  }

  if (hasSrcConfig(config)) {
    copyLib(config, ctx);
    await injectManifest(config, ctx);

  } else {
    await generateSW(config, ctx);
  }
}

async function copyLib(config: BuildConfig, ctx: BuildContext) {
  const timeSpan = config.logger.createTimeSpan(`copy service worker library started`, true);

  try {
    await config.sys.workbox.copyWorkboxLibraries(config.wwwDir);

  } catch (e) {
    catchError(ctx.diagnostics, e);
  }

  timeSpan.finish(`copy service worker library finished`);
}

async function generateSW(config: BuildConfig, ctx: BuildContext) {
  const timeSpan = config.logger.createTimeSpan(`generate service worker started`);

  try {
    await config.sys.workbox.generateSW(config.serviceWorker);
    timeSpan.finish(`generate service worker finished`);

  } catch (e) {
    catchError(ctx.diagnostics, e);
  }
}

async function injectManifest(config: BuildConfig, ctx: BuildContext) {
  const timeSpan = config.logger.createTimeSpan(`inject manifest into service worker started`);

  try {
    await config.sys.workbox.injectManifest(config.serviceWorker);
    timeSpan.finish('inject manifest into service worker finished');

  } catch (e) {
    catchError(ctx.diagnostics, e);
  }
}

function hasSrcConfig(config: BuildConfig) {
  const serviceWorkerConfig = config.serviceWorker as ServiceWorkerConfig;
  return !!serviceWorkerConfig.swSrc;
}

