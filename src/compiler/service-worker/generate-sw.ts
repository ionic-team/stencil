import { BuildCtx, Config, CompilerCtx, ServiceWorkerConfig } from '../../util/interfaces';
import { buildWarn, catchError } from '../util';


export async function generateServiceWorker(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  if (!config.generateWWW) {
    config.logger.debug(`generateServiceWorker, not generating www`);
    return;
  }

  if (await !compilerCtx.fs.access(config.srcIndexHtml)) {
    config.logger.debug(`generateServiceWorker, no index.html, so skipping sw build`);
    return;
  }

  if (!config.serviceWorker) {
    // no sw config, let's not continue
    return;
  }

  if (hasSrcConfig(config)) {
    copyLib(config, buildCtx);
    await injectManifest(config, buildCtx);

  } else {
    await generateSW(config, buildCtx);
  }
}

async function copyLib(config: Config, buildCtx: BuildCtx) {
  const timeSpan = config.logger.createTimeSpan(`copy service worker library started`, true);

  try {
    await config.sys.workbox.copyWorkboxLibraries(config.wwwDir);

  } catch (e) {
    // workaround for workbox issue in the latest alpha
    const d = buildWarn(buildCtx.diagnostics);
    d.messageText = 'Service worker library already exists';
  }

  timeSpan.finish(`copy service worker library finished`);
}

async function generateSW(config: Config, buildCtx: BuildCtx) {
  const timeSpan = config.logger.createTimeSpan(`generate service worker started`);

  try {
    await config.sys.workbox.generateSW(config.serviceWorker);
    timeSpan.finish(`generate service worker finished`);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}

async function injectManifest(config: Config, buildCtx: BuildCtx) {
  const timeSpan = config.logger.createTimeSpan(`inject manifest into service worker started`);

  try {
    await config.sys.workbox.injectManifest(config.serviceWorker);
    timeSpan.finish('inject manifest into service worker finished');

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}

function hasSrcConfig(config: Config) {
  const serviceWorkerConfig = config.serviceWorker as ServiceWorkerConfig;
  return !!serviceWorkerConfig.swSrc;
}

