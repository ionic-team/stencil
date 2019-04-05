import * as d from '../../declarations';
import { buildError } from '@utils';
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
  const pkgData = await readPackageJson(config, compilerCtx, buildCtx);
  if (pkgData == null) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate types started`, true);

  await Promise.all(outputTargets.map(outputsTarget => {
    return generateTypesAndValidate(config, compilerCtx, buildCtx, pkgData, outputsTarget);
  }));

  timespan.finish(`generate types finished`);
}


async function readPackageJson(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const pkgJsonPath = config.sys.path.join(config.rootDir, 'package.json');

  let pkgJson: string;
  try {
    pkgJson = await compilerCtx.fs.readFile(pkgJsonPath);

  } catch (e) {
    const diagnostic = buildError(buildCtx.diagnostics);
    diagnostic.header = `Missing "package.json"`;
    diagnostic.messageText = `Valid "package.json" file is required for distribution: ${pkgJsonPath}`;
    return null;
  }

  let pkgData: d.PackageJsonData;
  try {
    pkgData = JSON.parse(pkgJson);

  } catch (e) {
    const diagnostic = buildError(buildCtx.diagnostics);
    diagnostic.header = `Error parsing "package.json"`;
    diagnostic.messageText = `${pkgJsonPath}, ${e}`;
    return null;
  }

  return pkgData;
}
