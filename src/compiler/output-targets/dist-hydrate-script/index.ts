import type * as d from '../../../declarations';
import { generateHydrateApp } from './generate-hydrate-app';
import { isOutputTargetHydrate } from '../output-utils';

export const outputHydrateScript = async (config: d.Config, buildCtx: d.BuildCtx) => {
  const hydrateOutputTargets = config.outputTargets.filter(isOutputTargetHydrate);
  if (hydrateOutputTargets.length > 0) {
    const timespan = buildCtx.createTimeSpan(`generate hydrate app started`);

    await generateHydrateApp(config, buildCtx, hydrateOutputTargets);

    timespan.finish(`generate hydrate app finished`);
  }
};
