import { Config, ServiceWorkerConfig, CompilerCtx } from '../../util/interfaces';
import { minifyJs } from '../util';


export async function injectRegisterServiceWorker(config: Config, compilerCtx: CompilerCtx, swConfig: ServiceWorkerConfig, indexHtml: string) {
  const match = indexHtml.match(BODY_CLOSE_REG);

  let swUrl = config.sys.path.relative(config.wwwDir, swConfig.swDest);
  if (swUrl.charAt(0) !== '/') {
    swUrl = '/' + swUrl;
  }
  if (match) {
    let serviceWorker = getRegisterSwScript(swUrl);
    if (config.minifyJs) {
      const minifyResults = await minifyJs(config, compilerCtx, serviceWorker, 'es5', false);
      minifyResults.diagnostics.forEach(d => {
        (config.logger as any)[d.level](d.messageText);
      });

      if (!minifyResults.diagnostics.length) {
        serviceWorker = minifyResults.output;
      }
    }
    indexHtml = indexHtml.replace(match[0], `<script>${serviceWorker}</script>\n${match[0]}`);
  }

  return indexHtml;
}


export function injectUnregisterServiceWorker(indexHtml: string) {
  const match = indexHtml.match(BODY_CLOSE_REG);

  if (match) {
    indexHtml = indexHtml.replace(match[0], `${UNREGSITER_SW}\n${match[0]}`);
  }

  return indexHtml;
}


function getRegisterSwScript(swUrl: string) {
  return `
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      window.addEventListener('load', function(){
        navigator.serviceWorker.register('${swUrl}')
          .then(function(reg) {
            console.log('service worker registered', reg);

            reg.onupdatefound = function() {
              var installingWorker = reg.installing;

              installingWorker.onstatechange = function() {
                if (installingWorker.state === 'installed') {
                  window.dispatchEvent(new Event('swUpdate'))
                }
              }
            }
          })
          .catch(function(err) { console.log('service worker error', err) });
      });
    }
`;
}


const UNREGSITER_SW = `
  <script>
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      // auto-unregister service worker during dev mode
      navigator.serviceWorker.ready.then(function(registration) {
        registration.unregister().then(function() { location.reload(true) });
      });
    }
  </script>
`;


const BODY_CLOSE_REG = /<\/body>/i;
