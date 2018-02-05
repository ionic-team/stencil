import { BuildCtx, CompilerCtx, Config, ServiceWorkerConfig } from '../../declarations';
import { buildWarn, catchError, hasError } from '../util';


export async function generateServiceWorker(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  const shouldSkipSW = await canSkipGenerateSW(config, compilerCtx, buildCtx);
  if (shouldSkipSW) {
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


async function canSkipGenerateSW(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  if (!config.generateWWW) {
    config.logger.debug(`generateServiceWorker, not generating www`);
    return true;
  }

  const hasSrcIndexHtml = await compilerCtx.fs.access(config.srcIndexHtml);
  if (!hasSrcIndexHtml) {
    config.logger.debug(`generateServiceWorker, no index.html, so skipping sw build`);
    return true;
  }

  if (!config.serviceWorker) {
    // no sw config, let's not continue
    return true;
  }

  if ((compilerCtx.hasSuccessfulBuild && buildCtx.appFileBuildCount === 0) || hasError(buildCtx.diagnostics) || !config.generateWWW) {
    // no need to rebuild index.html if there were no app file changes
    return true;
  }

  // let's build us some service workerz
  return false;
}
