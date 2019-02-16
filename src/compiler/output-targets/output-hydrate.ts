import * as d from '@declarations';
import { generateHydrateApp } from '../component-hydrate/generate-hydrate-app';
import { isOutputTargetAngular, isOutputTargetDist, isOutputTargetWww } from './output-utils';


export async function outputHydrate(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!config.flags || !config.flags.prerender) {
    return;
  }

  const wwwOutputTargets = config.outputTargets
    .filter(isOutputTargetWww)
    .filter(o => o.indexHtml);

  const distOutputTargets = config.outputTargets
    .filter(isOutputTargetDist);

  const angularOutputTargets = config.outputTargets
    .filter(isOutputTargetAngular)
    .filter(o => o.serverModuleFile);

  const outputTargets = [
    ...wwwOutputTargets,
    ...distOutputTargets,
    ...angularOutputTargets
  ];

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate renderer started`, true);

  await generateHydrateApp(config, compilerCtx, buildCtx, outputTargets);

  timespan.finish(`generate renderer finished`);
}
