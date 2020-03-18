import * as d from '../../../declarations';
import { generateHydrateApp } from './generate-hydrate-app';
import { isOutputTargetHydrate } from '../output-utils';

export const outputHydrateScript = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const hydrateOutputTargets = config.outputTargets.filter(isOutputTargetHydrate);
  if (hydrateOutputTargets.length > 0) {
    if (config.devMode && config.watch) {
      buildCtx.debug(`hydrate app output skipped during dev watch builds`);
      return;
    }

    const timespan = buildCtx.createTimeSpan(`generate hydrate app started`);

    await generateHydrateApp(config, compilerCtx, buildCtx, hydrateOutputTargets);

    timespan.finish(`generate hydrate app finished`);
  }
};
