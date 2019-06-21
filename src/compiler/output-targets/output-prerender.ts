import * as d from '../../declarations';
import { buildError } from '@utils';
import { isOutputTargetWww } from '../output-targets/output-utils';
import { runPrerenderMain } from '../prerender/prerender-main';


export async function outputPrerender(config: d.Config, buildCtx: d.BuildCtx) {
  if (typeof config.srcIndexHtml !== 'string') {
    return;
  }

  if (!config.flags || !config.flags.prerender) {
    return;
  }

  if (typeof buildCtx.hydrateAppFilePath !== 'string') {
    const diagnostic = buildError(buildCtx.diagnostics);
    diagnostic.messageText = `hydrateAppFilePath was not found in order to prerender www output target`;
    return;
  }

  const outputTargets = config.outputTargets
    .filter(isOutputTargetWww)
    .filter(o => typeof o.indexHtml === 'string');

  await Promise.all(outputTargets.map(outputTarget => {
    return prerenderOutputTarget(config, buildCtx, outputTarget);
  }));
}


async function prerenderOutputTarget(config: d.Config, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  // if there was src index.html file, then the process before this one
  // would have already loaded and updated the src index to its www path
  // get the www index html content for the template for all prerendered pages
  if (typeof buildCtx.hydrateAppFilePath !== 'string') {
    buildCtx.debug(`prerenderOutputTarget, missing hydrateAppFilePath for prerendering`);
    return;
  }

  await runPrerenderMain(config, buildCtx, outputTarget);
}
