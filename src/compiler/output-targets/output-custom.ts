import type * as d from '../../declarations';
import { catchError } from '@utils';
import { isOutputTargetCustom } from './output-utils';

export const outputCustom = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  docs: d.JsonDocs,
  outputTargets: d.OutputTarget[]
) => {
  const customOutputTargets = outputTargets.filter(isOutputTargetCustom);
  if (customOutputTargets.length === 0) {
    return;
  }

  await Promise.all(
    customOutputTargets.map(async (o) => {
      const timespan = buildCtx.createTimeSpan(`generating ${o.name} started`);
      try {
        await o.generator(config, compilerCtx, buildCtx, docs);
      } catch (e: any) {
        catchError(buildCtx.diagnostics, e);
      }
      timespan.finish(`generate ${o.name} finished`);
    })
  );
};
