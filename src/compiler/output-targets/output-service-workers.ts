import * as d from '../../declarations';
import { generateServiceWorker } from '../service-worker/generate-sw';
import { isOutputTargetWww } from './output-utils';

export async function outputServiceWorkers(config: d.Config, buildCtx: d.BuildCtx) {
  const wwwServiceOutputs = config.outputTargets
    .filter(isOutputTargetWww)
    .filter(o => typeof o.indexHtml === 'string' && !!o.serviceWorker);

  if (wwwServiceOutputs.length === 0) {
    return;
  }

  if (config.sys.lazyRequire == null) {
    return;
  }

  // let's make sure they have what we need from workbox installed
  await config.sys.lazyRequire.ensure(config.logger, config.rootDir, [WORKBOX_BUILD_MODULE_ID]);

  // we've ensure workbox is installed, so let's require it now
  const workbox: d.Workbox = config.sys.lazyRequire.require(WORKBOX_BUILD_MODULE_ID);

  await Promise.all(
    wwwServiceOutputs.map(outputTarget => (
      generateServiceWorker(config, buildCtx, workbox, outputTarget)
    ))
  );
}

const WORKBOX_BUILD_MODULE_ID = 'workbox-build';
