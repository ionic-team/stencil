import * as d from '@declarations';
import { generateHydrateApp } from '../component-hydrate/generate-hydrate-app';


export async function outputHydrate(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!config.flags || !config.flags.prerender) {
    return;
  }

  const wwwOutputTargets = (config.outputTargets as d.OutputTargetWww[]).filter(o => {
    return (o.type === 'www' && typeof o.indexHtml === 'string');
  });

  const distOutputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(o => {
    return (o.type === 'dist');
  });

  const angularOutputTargets = (config.outputTargets as d.OutputTargetAngular[]).filter(o => {
    return (o.type === 'angular');
  });

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
