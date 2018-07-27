import * as d from '../../declarations';
import { buildWarn, catchError, hasError, hasServiceWorkerChanges } from '../util';

export async function generateServiceWorkers(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const wwwServiceOutputs = (config.outputTargets as d.OutputTargetWww[]).filter(o => o.type === 'www' && o.serviceWorker);

  await Promise.all(wwwServiceOutputs.map(async outputTarget => {
    await generateServiceWorker(config, compilerCtx, buildCtx, outputTarget);
  }));
}


async function generateServiceWorker(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
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
    await generateSW(config, buildCtx, outputTarget.serviceWorker);
  }
}


async function copyLib(config: d.Config, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  const timeSpan = buildCtx.createTimeSpan(`copy service worker library started`, true);

  try {
    await config.sys.workbox.copyWorkboxLibraries(outputTarget.dir);

  } catch (e) {
    // workaround for workbox issue in the latest alpha
    const d = buildWarn(buildCtx.diagnostics);
    d.messageText = 'Service worker library already exists';
  }

  timeSpan.finish(`copy service worker library finished`);
}


async function generateSW(config: d.Config, buildCtx: d.BuildCtx, serviceWorker: d.ServiceWorkerConfig) {
  const timeSpan = buildCtx.createTimeSpan(`generate service worker started`);

  try {
    await config.sys.workbox.generateSW(serviceWorker);
    timeSpan.finish(`generate service worker finished`);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}


async function injectManifest(config: d.Config, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  const timeSpan = buildCtx.createTimeSpan(`inject manifest into service worker started`);

  try {
    await config.sys.workbox.injectManifest(outputTarget.serviceWorker);
    timeSpan.finish('inject manifest into service worker finished');

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}


function hasSrcConfig(outputTarget: d.OutputTargetWww) {
  return !!outputTarget.serviceWorker.swSrc;
}


async function canSkipGenerateSW(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  if (!outputTarget.serviceWorker) {
    return true;
  }

  if (!config.srcIndexHtml) {
    return true;
  }

  const hasServiceWorkerChanged = hasServiceWorkerChanges(config, buildCtx);
  if ((compilerCtx.hasSuccessfulBuild && buildCtx.appFileBuildCount === 0 && !hasServiceWorkerChanged) || hasError(buildCtx.diagnostics)) {
    // no need to rebuild index.html if there were no app file changes
    return true;
  }

  const hasSrcIndexHtml = await compilerCtx.fs.access(config.srcIndexHtml);
  if (!hasSrcIndexHtml) {
    buildCtx.debug(`generateServiceWorker, no index.html, so skipping sw build`);
    return true;
  }

  // let's build us some service workerz
  return false;
}
