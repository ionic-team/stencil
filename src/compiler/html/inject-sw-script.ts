import type * as d from '../../declarations';
import { generateServiceWorkerUrl } from '../service-worker/service-worker-util';
import { UNREGISTER_SW, getRegisterSW } from '../service-worker/generate-sw';

export const updateIndexHtmlServiceWorker = async (
  config: d.Config,
  buildCtx: d.BuildCtx,
  doc: Document,
  outputTarget: d.OutputTargetWww
) => {
  const serviceWorker = outputTarget.serviceWorker;

  if (serviceWorker !== false) {
    if ((serviceWorker && serviceWorker.unregister) || (!serviceWorker && config.devMode)) {
      injectUnregisterServiceWorker(doc);
    } else if (serviceWorker) {
      await injectRegisterServiceWorker(buildCtx, outputTarget, doc);
    }
  }
};

const injectRegisterServiceWorker = async (buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, doc: Document) => {
  const swUrl = generateServiceWorkerUrl(outputTarget, outputTarget.serviceWorker as d.ServiceWorkerConfig);
  const serviceWorker = getRegisterSwScript(doc, buildCtx, swUrl);
  doc.body.appendChild(serviceWorker);
};

const injectUnregisterServiceWorker = (doc: Document) => {
  const script = doc.createElement('script');
  script.innerHTML = UNREGISTER_SW;
  doc.body.appendChild(script);
};

const getRegisterSwScript = (doc: Document, buildCtx: d.BuildCtx, swUrl: string) => {
  const script = doc.createElement('script');
  script.setAttribute('data-build', `${buildCtx.timestamp}`);
  script.innerHTML = getRegisterSW(swUrl);
  return script;
};
