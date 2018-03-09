import { BuildCtx, CompilerCtx, Config, OutputTarget } from '../../declarations';
import { buildWarn, catchError, hasError } from '../util';


export async function generateServiceWorkers(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  return Promise.all(config.outputTargets.map(outputTarget => {
    return generateServiceWorker(config, compilerCtx, buildCtx, outputTarget);
  }));
}


async function generateServiceWorker(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, outputTarget: OutputTarget) {
  const shouldSkipSW = await canSkipGenerateSW(config, compilerCtx, buildCtx, outputTarget);
  if (shouldSkipSW) {
    return;
  }

  if (hasSrcConfig(outputTarget)) {
    await Promise.all([
      copyLib(config, buildCtx, outputTarget),
      injectManifest(config, buildCtx, outputTarget)
    ]);

  } else {
    await generateSW(config, buildCtx, outputTarget);
  }
}


async function copyLib(config: Config, buildCtx: BuildCtx, outputTarget: OutputTarget) {
  const timeSpan = config.logger.createTimeSpan(`copy service worker library started`, true);

  try {
    await config.sys.workbox.copyWorkboxLibraries(outputTarget.dir);

  } catch (e) {
    // workaround for workbox issue in the latest alpha
    const d = buildWarn(buildCtx.diagnostics);
    d.messageText = 'Service worker library already exists';
  }

  timeSpan.finish(`copy service worker library finished`);
}


async function generateSW(config: Config, buildCtx: BuildCtx, outputTarget: OutputTarget) {
  const timeSpan = config.logger.createTimeSpan(`generate service worker started`);

  try {
    await config.sys.workbox.generateSW(outputTarget.serviceWorker);
    timeSpan.finish(`generate service worker finished`);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}


async function injectManifest(config: Config, buildCtx: BuildCtx, outputTarget: OutputTarget) {
  const timeSpan = config.logger.createTimeSpan(`inject manifest into service worker started`);

  try {
    await config.sys.workbox.injectManifest(outputTarget.serviceWorker);
    timeSpan.finish('inject manifest into service worker finished');

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}


function hasSrcConfig(outputTarget: OutputTarget) {
  return !!outputTarget.serviceWorker.swSrc;
}


async function canSkipGenerateSW(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, outputTarget: OutputTarget) {
  if (!outputTarget.serviceWorker) {
    return true;
  }

  if (!config.srcIndexHtml) {
    return true;
  }

  if ((compilerCtx.hasSuccessfulBuild && buildCtx.appFileBuildCount === 0) || hasError(buildCtx.diagnostics)) {
    // no need to rebuild index.html if there were no app file changes
    return true;
  }

  const hasSrcIndexHtml = await compilerCtx.fs.access(config.srcIndexHtml);
  if (!hasSrcIndexHtml) {
    config.logger.debug(`generateServiceWorker, no index.html, so skipping sw build`);
    return true;
  }

  // let's build us some service workerz
  return false;
}
