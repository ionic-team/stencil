import * as d from '@declarations';
import { generateTypesAndValidate } from '../types/generate-types';
import { sys } from '@sys';
import { isOutputTargetDist } from './output-utils';


export async function outputTypes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDist);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate types started`, true);

  const pkgData = await readPackageJson(config, compilerCtx);

  await Promise.all(outputTargets.map(outputsTarget => {
    return generateTypesAndValidate(config, compilerCtx, buildCtx, pkgData, outputsTarget);
  }));

  timespan.finish(`generate types finished`);
}


async function readPackageJson(config: d.Config, compilerCtx: d.CompilerCtx) {
  const pkgJsonPath = sys.path.join(config.rootDir, 'package.json');

  let pkgJson: string;
  try {
    pkgJson = await compilerCtx.fs.readFile(pkgJsonPath);

  } catch (e) {
    throw new Error(`Missing "package.json" file for distribution: ${pkgJsonPath}`);
  }

  let pkgData: d.PackageJsonData;
  try {
    pkgData = JSON.parse(pkgJson);

  } catch (e) {
    throw new Error(`Error parsing package.json: ${pkgJsonPath}, ${e}`);
  }

  return pkgData;
}
