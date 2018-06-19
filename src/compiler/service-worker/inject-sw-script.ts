import * as d from '../../declarations';
import { appendSwScript, generateServiceWorkerUrl } from './service-worker-util';


export async function updateIndexHtmlServiceWorker(config: d.Config, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, indexHtml: string) {
  if (!outputTarget.serviceWorker && config.devMode) {
    // if we're not generating a sw, and this is a dev build
    // then let's inject a script that always unregisters any service workers
    indexHtml = injectUnregisterServiceWorker(indexHtml);

  } else if (outputTarget.serviceWorker) {
    // we have a valid sw config, so we'll need to inject the register sw script
    indexHtml = await injectRegisterServiceWorker(config, buildCtx, outputTarget, indexHtml);
  }

  return indexHtml;
}


export async function injectRegisterServiceWorker(config: d.Config, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, indexHtml: string) {
  const swUrl = generateServiceWorkerUrl(config, outputTarget);

  const serviceWorker = getRegisterSwScript(swUrl);
  const swHtml = `<script data-build="${buildCtx.timestamp}">${serviceWorker}</script>`;

  return appendSwScript(indexHtml, swHtml);
}


export function injectUnregisterServiceWorker(indexHtml: string) {
  return appendSwScript(indexHtml, UNREGSITER_SW);
}


function getRegisterSwScript(swUrl: string) {
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
    }
`;
}


const UNREGSITER_SW = `
  <script>
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      // auto-unregister service worker during dev mode
      navigator.serviceWorker.getRegistration().then(function(registration) {
        if (registration) {
          registration.unregister().then(function() { location.reload(true) });
        }
      });
    }
  </script>
`;
