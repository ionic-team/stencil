import * as d from '../../declarations';
import { buildWarn, catchError } from '@utils';
import { isOutputTargetWww } from '../output-targets/output-utils';

export async function generateServiceWorker(buildCtx: d.BuildCtx, workbox: d.Workbox, outputTarget: d.OutputTargetWww) {
  if (outputTarget.serviceWorker.swSrc) {
    return Promise.all([
      copyLib(buildCtx, outputTarget, workbox),
      injectManifest(buildCtx, outputTarget, workbox)
    ]);

  } else {
    return generateSW(buildCtx, outputTarget.serviceWorker, workbox);
  }
}

async function copyLib(buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, workbox: d.Workbox) {
  const timeSpan = buildCtx.createTimeSpan(`copy service worker library started`, true);

  try {
    await workbox.copyWorkboxLibraries(outputTarget.dir);

  } catch (e) {
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


export function hasServiceWorkerChanges(config: d.Config, buildCtx: d.BuildCtx) {
  if (config.devMode && !config.flags.serviceWorker) {
    return false;
  }

  const wwwServiceOutputs = config.outputTargets
    .filter(isOutputTargetWww)
    .filter(o => o.serviceWorker && o.serviceWorker.swSrc);

  return wwwServiceOutputs.some(outputTarget => {
    return buildCtx.filesChanged.some(fileChanged => config.sys.path.basename(fileChanged).toLowerCase() === config.sys.path.basename(outputTarget.serviceWorker.swSrc).toLowerCase());
  });
}

export function getRegisterSW(swUrl: string) {
  return `
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('${swUrl}')
      .then(function(reg) {
        reg.onupdatefound = function() {
          var installingWorker = reg.installing;
          installingWorker.onstatechange = function() {
            if (installingWorker.state === 'installed') {
              window.dispatchEvent(new Event('swUpdate'))
            }
          }
        }
      })
      .catch(function(err) { console.error('service worker error', err) });
  });
}`;
}

export const UNREGISTER_SW = `
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  // auto-unregister service worker during dev mode
  navigator.serviceWorker.getRegistration().then(function(registration) {
    if (registration) {
      registration.unregister().then(function() { location.reload(true) });
    }
  });
}
`;
