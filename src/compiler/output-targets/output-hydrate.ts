import * as d from '../../declarations';
import { canSkipAppCoreBuild, isOutputTargetHydrate } from './output-utils';
import { generateHydrateApp } from '../component-hydrate/generate-hydrate-app';


export async function outputHydrate(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (canSkipAppCoreBuild(buildCtx)) {
    return;
  }

  const hydrateOutputTargets = config.outputTargets.filter(isOutputTargetHydrate);

  if (hydrateOutputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate hydrate app started`, true);

  await generateHydrateApp(config, compilerCtx, buildCtx, hydrateOutputTargets);

  timespan.finish(`generate hydrate app finished`);
}
