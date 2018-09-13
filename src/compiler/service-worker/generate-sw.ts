import * as d from '../../declarations';
import { buildWarn, catchError, hasError, hasServiceWorkerChanges } from '../util';


export async function generateServiceWorkers(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const wwwServiceOutputs = await getServiceWorkerOutputs(config, compilerCtx, buildCtx);

  if (wwwServiceOutputs.length === 0) {
    // no output targets require service workers
    return;
  }

  // let's make sure they have what we need from workbox installed
  await config.sys.lazyRequire.ensure(config.logger, config.rootDir, [WORKBOX_BUILD_MODULE_ID]);

  // we've ensure workbox is installed, so let's require it now
  const workbox: d.Workbox = config.sys.lazyRequire.require(WORKBOX_BUILD_MODULE_ID);

  const promises = wwwServiceOutputs.map(async outputTarget => {
    await generateServiceWorker(buildCtx, outputTarget, workbox);
  });

  await Promise.all(promises);
}


async function generateServiceWorker(buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, workbox: d.Workbox) {
  if (hasSrcConfig(outputTarget)) {
    await Promise.all([
      copyLib(buildCtx, outputTarget, workbox),
      injectManifest(buildCtx, outputTarget, workbox)
    ]);

  } else {
    await generateSW(buildCtx, outputTarget.serviceWorker, workbox);
  }
}


async function copyLib(buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, workbox: d.Workbox) {
  const timeSpan = buildCtx.createTimeSpan(`copy service worker library started`, true);

  try {
    await workbox.copyWorkboxLibraries(outputTarget.dir);

  } catch (e) {
    // workaround for workbox issue in the latest alpha
    const d = buildWarn(buildCtx.diagnostics);
    d.messageText = 'Service worker library already exists';
  }

  timeSpan.finish(`copy service worker library finished`);
}


async function generateSW(buildCtx: d.BuildCtx, serviceWorker: d.ServiceWorkerConfig, workbox: d.Workbox) {
  const timeSpan = buildCtx.createTimeSpan(`generate service worker started`);

  try {
    await workbox.generateSW(serviceWorker);
    timeSpan.finish(`generate service worker finished`);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}


async function injectManifest(buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, workbox: d.Workbox) {
  const timeSpan = buildCtx.createTimeSpan(`inject manifest into service worker started`);

  try {
    await workbox.injectManifest(outputTarget.serviceWorker);
    timeSpan.finish('inject manifest into service worker finished');

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}


function hasSrcConfig(outputTarget: d.OutputTargetWww) {
  return !!outputTarget.serviceWorker.swSrc;
}


async function getServiceWorkerOutputs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const outputTargets = (config.outputTargets as d.OutputTargetWww[]).filter(o => o.type === 'www' && o.serviceWorker);

  const wwwServiceOutputs: d.OutputTargetWww[] = [];

  for (let i = 0; i < outputTargets.length; i++) {
    const shouldSkipSW = await canSkipGenerateSW(config, compilerCtx, buildCtx, outputTargets[i]);
    if (!shouldSkipSW) {
      wwwServiceOutputs.push(outputTargets[i]);
    }
  }

  return wwwServiceOutputs;
}


async function canSkipGenerateSW(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  if (!outputTarget.serviceWorker) {
    return true;
  }

  if (!config.srcIndexHtml) {
    return true;
  }

  const hasServiceWorkerChanged = hasServiceWorkerChanges(config);
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

const WORKBOX_BUILD_MODULE_ID = 'workbox-build';
