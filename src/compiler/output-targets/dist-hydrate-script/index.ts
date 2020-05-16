import * as d from '../../../declarations';
import { generateHydrateApp } from './generate-hydrate-app';
import { isOutputTargetHydrate } from '../output-utils';

export const outputHydrateScript = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (!config.buildDist) {
    return;
  }
  
  const hydrateOutputTargets = config.outputTargets.filter(isOutputTargetHydrate);
  if (hydrateOutputTargets.length > 0) {
    const timespan = buildCtx.createTimeSpan(`generate hydrate app started`);

    await generateHydrateApp(config, compilerCtx, buildCtx, hydrateOutputTargets);

    timespan.finish(`generate hydrate app finished`);
  }
};
