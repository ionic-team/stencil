import * as d from '../../declarations';
import { isOutputTargetHydrate } from './output-utils';
import { generateHydrateApp } from '../component-hydrate/generate-hydrate-app';


export async function outputHydrate(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (config.devMode && !config.flags.prerender) {
    return;
  }
  const hydrateOutputTargets = config.outputTargets.filter(isOutputTargetHydrate);

  if (hydrateOutputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate hydrate app started`);

  await generateHydrateApp(config, compilerCtx, buildCtx, hydrateOutputTargets);

  timespan.finish(`generate hydrate app finished`);
}
