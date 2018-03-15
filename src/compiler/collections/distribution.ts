import * as d from '../../declarations';
import { buildError, buildWarn, hasError, normalizePath, pathJoin } from '../util';
import { COLLECTION_MANIFEST_FILE_NAME } from '../../util/constants';
import { copyComponentStyles } from '../copy/copy-styles';
import { generateTypes } from './collection-types';
import { getLoaderFileName } from '../app/app-file-naming';



export async function generateDistributions(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Promise<any> {
  const distOutputs = config.outputTargets.filter(o => o.type === 'dist');

  return Promise.all(distOutputs.map(outputTarget => {
    return generateDistribution(config, compilerCtx, buildCtx, outputTarget);
  }));
}


async function generateDistribution(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDist): Promise<any> {
  const pkgData = await readPackageJson(config, compilerCtx);

  validatePackageJson(config, outputTarget, buildCtx.diagnostics, pkgData);

  if (hasError(buildCtx.diagnostics)) {
    return;
  }

  await Promise.all([
    copyComponentStyles(config, compilerCtx, buildCtx),
    generateTypes(config, compilerCtx, buildCtx, pkgData)
  ]);
}


async function readPackageJson(config: d.Config, compilerCtx: d.CompilerCtx) {
  const pkgJsonPath = config.sys.path.join(config.rootDir, 'package.json');

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


export function validatePackageJson(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  validatePackageFiles(config, outputTarget, diagnostics, pkgData);

  const mainFileName = getLoaderFileName(config);
  const main = pathJoin(config, config.sys.path.relative(config.rootDir, outputTarget.buildDir), mainFileName);

  if (!pkgData.main || normalizePath(pkgData.main) !== main) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "main" property is required when generating a distribution and must be set to: ${main}`;
  }

  if (typeof pkgData.types !== 'string' || pkgData.types === '') {
    const componentsDtsFileAbsPath = config.sys.path.join(outputTarget.typesDir, COMPONENTS_DTS);
    const componentsDtsFileRelPath = pathJoin(config, config.sys.path.relative(config.rootDir, componentsDtsFileAbsPath));

    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "types" property is required when generating a distribution. Recommended entry d.ts file is: ${componentsDtsFileRelPath}`;

  } else if (!pkgData.types.endsWith('.d.ts')) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "types" file must have a ".d.ts" extension: ${pkgData.types}`;
  }

  const collection = pathJoin(config, config.sys.path.relative(config.rootDir, outputTarget.collectionDir), COLLECTION_MANIFEST_FILE_NAME);
  if (!pkgData.collection || normalizePath(pkgData.collection) !== collection) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "collection" property is required when generating a distribution and must be set to: ${collection}`;
  }

  if (typeof config.namespace !== 'string' || config.fsNamespace === 'app') {
    const err = buildWarn(diagnostics);
    err.header = `config warning`;
    err.messageText = `When generating a distribution it is recommended to choose a unique namespace, which can be updated using the "namespace" config property within the stencil.config.js file.`;
  }
}


export function validatePackageFiles(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  if (pkgData.files) {
    const actualDistDir = normalizePath(config.sys.path.relative(config.rootDir, outputTarget.dir));

    const validPaths = [
      `${actualDistDir}`,
      `${actualDistDir}/`,
      `./${actualDistDir}`,
      `./${actualDistDir}/`
    ];

    const containsDistDir = (pkgData.files as string[])
            .some(userPath => validPaths.some(validPath => normalizePath(userPath) === validPath));

    if (!containsDistDir) {
      const err = buildError(diagnostics);
      err.header = `package.json error`;
      err.messageText = `package.json "files" array must contain the distribution directory "${actualDistDir}/" when generating a distribution.`;
    }
  }
}


export function getComponentsDtsSrcFilePath(config: d.Config) {
  return pathJoin(config, config.srcDir, COMPONENTS_DTS);
}


export function getComponentsDtsTypesFilePath(config: d.Config, outputTarget: d.OutputTargetDist) {
  return pathJoin(config, outputTarget.typesDir, COMPONENTS_DTS);
}


export const COMPONENTS_DTS = 'components.d.ts';
