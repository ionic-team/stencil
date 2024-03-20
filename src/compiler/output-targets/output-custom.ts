import { catchError, isOutputTargetCustom } from '@utils';

import type * as d from '../../declarations';
import { generateDocData } from '../docs/generate-doc-data';

export const outputCustom = async (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const task = config.devMode ? 'run' : 'build';
  const docsData = await generateDocData(config, compilerCtx, buildCtx);
  const customOutputTargets = config.outputTargets
    .filter(isOutputTargetCustom)
    .filter((o) => (o.task === undefined ? true : o.task === task));
  if (customOutputTargets.length === 0) {
    return;
  }

  await Promise.all(
    customOutputTargets.map(async (o) => {
      const timespan = buildCtx.createTimeSpan(`generating ${o.name} started`);
      try {
        await o.generator(config, compilerCtx, buildCtx, docsData);
      } catch (e: any) {
        catchError(buildCtx.diagnostics, e);
      }
      timespan.finish(`generate ${o.name} finished`);
    }),
  );
};
