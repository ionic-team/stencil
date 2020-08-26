import type * as d from '../../declarations';
import { generateServiceWorker } from '../service-worker/generate-sw';
import { isOutputTargetWww } from './output-utils';

export const outputServiceWorkers = async (config: d.Config, buildCtx: d.BuildCtx) => {
  const wwwServiceOutputs = config.outputTargets
    .filter(isOutputTargetWww)
    .filter(o => typeof o.indexHtml === 'string' && !!o.serviceWorker);

  if (wwwServiceOutputs.length === 0 || config.sys.lazyRequire == null) {
    return;
  }

  // let's make sure they have what we need from workbox installed
  const diagnostics = await config.sys.lazyRequire.ensure(config.rootDir, ['workbox-build']);
  if (diagnostics.length > 0) {
    buildCtx.diagnostics.push(...diagnostics);
  } else {
    // we've ensure workbox is installed, so let's require it now
    const workbox: d.Workbox = config.sys.lazyRequire.require(config.rootDir, 'workbox-build');

    await Promise.all(
      wwwServiceOutputs.map(outputTarget => generateServiceWorker(config, buildCtx, workbox, outputTarget)),
    );
  }
};
