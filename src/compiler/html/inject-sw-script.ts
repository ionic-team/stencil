import * as d from '../../declarations';
import { generateServiceWorkerUrl } from '../service-worker/service-worker-util';
import { UNREGISTER_SW, getRegisterSW } from '../service-worker/generate-sw';


export async function updateIndexHtmlServiceWorker(doc: Document, config: d.Config, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  if (!outputTarget.serviceWorker && config.devMode) {
    // if we're not generating a sw, and this is a dev build
    // then let's inject a script that always unregisters any service workers
    injectUnregisterServiceWorker(doc);

  } else if (outputTarget.serviceWorker) {
    // we have a valid sw config, so we'll need to inject the register sw script
    await injectRegisterServiceWorker(config, buildCtx, outputTarget, doc);
  }
}


export async function injectRegisterServiceWorker(config: d.Config, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, doc: Document) {
  const swUrl = generateServiceWorkerUrl(config, outputTarget);
  const serviceWorker = getRegisterSwScript(doc, buildCtx, swUrl);
  doc.body.appendChild(serviceWorker);
}


export function injectUnregisterServiceWorker(doc: Document) {
  doc.body.appendChild(getUnregisterSwScript(doc));
}


function getRegisterSwScript(doc: Document, buildCtx: d.BuildCtx, swUrl: string) {
  const script = doc.createElement('script');
  script.setAttribute('data-build', `${buildCtx.timestamp}`);
  script.innerHTML = getRegisterSW(swUrl);
return script;
}

function getUnregisterSwScript(doc: Document) {
  const script = doc.createElement('script');
  script.innerHTML = UNREGISTER_SW;
  return script;
}
