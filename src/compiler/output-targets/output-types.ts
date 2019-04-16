import * as d from '../../declarations';
import { canSkipAppCoreBuild, isOutputTargetDistCollection } from './output-utils';
import { generateTypesAndValidate } from '../types/generate-types';


export async function outputTypes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (canSkipAppCoreBuild(buildCtx)) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCollection);
  if (outputTargets.length === 0) {
    return;
  }

  return writeTypes(config, compilerCtx, buildCtx, outputTargets);
}


async function writeTypes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistCollection[]) {
  const pkgData = buildCtx.packageJson;
  if (pkgData == null) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate types started`, true);

  await Promise.all(outputTargets.map(outputsTarget => {
    return generateTypesAndValidate(config, compilerCtx, buildCtx, pkgData, outputsTarget);
  }));

  timespan.finish(`generate types finished`);
}

