import * as d from '../../declarations';
import { injectRegisterServiceWorker, injectUnregisterServiceWorker } from '../service-worker/inject-sw-script';


export async function indexHtmlServiceWorkerUpdate(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww, indexHtml: string) {
  if (!outputTarget.serviceWorker && config.devMode) {
    // if we're not generating a sw, and this is a dev build
    // then let's inject a script that always unregisters any service workers
    indexHtml = injectUnregisterServiceWorker(indexHtml);

  } else if (outputTarget.serviceWorker) {
    // we have a valid sw config, so we'll need to inject the register sw script
    indexHtml = await injectRegisterServiceWorker(config, outputTarget, indexHtml);
  }

  // add the prerendered html to our list of files to write
  await compilerCtx.fs.writeFile(outputTarget.indexHtml, indexHtml);

  config.logger.debug(`optimizeHtml, write: ${outputTarget.indexHtml}`);
}
