import * as d from '@declarations';
import { isOutputTargetWww } from '../output-targets/output-utils';
import { runPrerenderMain } from '../prerender/prerender-main';


export async function outputPrerender(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (typeof config.srcIndexHtml !== 'string') {
    return;
  }

  if (!config.flags || !config.flags.prerender) {
    return;
  }

  const outputTargets = config.outputTargets
    .filter(isOutputTargetWww)
    .filter(o => typeof o.indexHtml === 'string')
    .filter(o => o.prerenderLocations != null && o.prerenderLocations.length > 0);

  await Promise.all(outputTargets.map(outputTarget => {
    return prerenderOutputTarget(config, compilerCtx, buildCtx, outputTarget);
  }));
}


async function prerenderOutputTarget(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  // if there was src index.html file, then the process before this one
  // would have already loaded and updated the src index to its www path
  // get the www index html content for the template for all prerendered pages
  let templateHtml: string = null;
  try {
    templateHtml = await compilerCtx.fs.readFile(outputTarget.indexHtml);
  } catch (e) {}

  if (typeof templateHtml !== 'string') {
    // looks like we don't have an index html file, which is fine
    buildCtx.debug(`prerenderOutputTarget, missing index.html for prerendering`);
    return;
  }

  if (typeof buildCtx.hydrateAppFilePath !== 'string') {
    buildCtx.debug(`prerenderOutputTarget, missing hydrateAppFilePath for prerendering`);
    return;
  }

  await runPrerenderMain(config, compilerCtx, buildCtx, outputTarget, templateHtml);
}
