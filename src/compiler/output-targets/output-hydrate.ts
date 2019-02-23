import * as d from '@declarations';
import { generateHydrateApp } from '../component-hydrate/generate-hydrate-app';
import { isOutputTargetHydrate } from './output-utils';


export async function outputHydrate(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const hydrateOutputTargets = config.outputTargets.filter(isOutputTargetHydrate);

  if (hydrateOutputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate hydrate app started`, true);

  await generateHydrateApp(config, compilerCtx, buildCtx, hydrateOutputTargets);

  timespan.finish(`generate hydrate app finished`);
}
