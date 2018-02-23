import { BuildCtx, CompilerCtx, Config, Diagnostic, PackageJsonData } from '../../declarations';
import { buildError, buildWarn, catchError, isDtsFile, normalizePath } from '../util';
import { COLLECTION_MANIFEST_FILE_NAME } from '../../util/constants';
import { copyComponentStyles } from '../copy/copy-styles';
import { getLoaderFileName } from '../app/app-file-naming';
import { pathJoin } from '../util';



export async function generateDistribution(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx): Promise<any> {
  if (!config.generateDistribution) {
    // don't bother
    return;
  }

  const pkgData = await readPackageJson(config, compilerCtx, buildCtx);

  await Promise.all([
    copyComponentStyles(config, compilerCtx, buildCtx),
    generateTypes(config, compilerCtx, buildCtx, pkgData)
  ]);
}


async function readPackageJson(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  const packageJsonPath = config.sys.path.join(config.rootDir, 'package.json');

  let packageJsonText: string;

  try {
    packageJsonText = await compilerCtx.fs.readFile(packageJsonPath);

  } catch (e) {
    throw new Error(`Missing "package.json" file for distribution: ${packageJsonPath}`);
  }

  let pkgData: PackageJsonData;
  try {
    pkgData = JSON.parse(packageJsonText);

  } catch (e) {
    throw new Error(`Error parsing package.json: ${packageJsonPath}, ${e}`);
  }

  return validatePackageJson(config, buildCtx.diagnostics, pkgData);
}


export function validatePackageJson(config: Config, diagnostics: Diagnostic[], pkgData: PackageJsonData) {
  validatePackageFiles(config, diagnostics, pkgData);

  const mainFileName = getLoaderFileName(config);
  const main = pathJoin(config, config.sys.path.relative(config.rootDir, config.distDir), mainFileName);
  if (!pkgData.main || normalizePath(pkgData.main) !== main) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "main" property is required when generating a distribution and must be set to: ${main}`;
  }

  if (typeof pkgData.types !== 'string' || pkgData.types === '') {
    const componentsDtsFileAbsPath = config.sys.path.join(config.typesDir, COMPONENTS_DTS);
    const componentsDtsFileRelPath = pathJoin(config, config.sys.path.relative(config.rootDir, componentsDtsFileAbsPath));

    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "types" property is required when generating a distribution. Recommended entry d.ts file is: ${componentsDtsFileRelPath}`;

  } else if (!pkgData.types.endsWith('.d.ts')) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "types" file must have a ".d.ts" extension: ${pkgData.types}`;
  }

  const collection = pathJoin(config, config.sys.path.relative(config.rootDir, config.collectionDir), COLLECTION_MANIFEST_FILE_NAME);
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

  return pkgData;
}


export function validatePackageFiles(config: Config, diagnostics: Diagnostic[], pkgData: PackageJsonData) {
  if (pkgData.files) {
    const actualDistDir = normalizePath(config.sys.path.relative(config.rootDir, config.distDir));

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


async function generateTypes(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, pkgData: PackageJsonData) {
  if (typeof pkgData.types !== 'string') {
    return;
  }

  const srcDirItems = await compilerCtx.fs.readdir(config.srcDir, { recursive: false });
  const srcDtsFiles = srcDirItems.filter(srcItem => srcItem.isFile && isDtsFile(srcItem.absPath));
  await Promise.all(srcDtsFiles.map(async srcDtsFile => {
    const relPath = config.sys.path.relative(config.srcDir, srcDtsFile.absPath);
    const distTypesDir = config.sys.path.dirname(pkgData.types);
    const distPath = pathJoin(config, config.rootDir, distTypesDir, relPath);

    const dtsContent = await compilerCtx.fs.readFile(srcDtsFile.absPath);
    await compilerCtx.fs.writeFile(distPath, dtsContent);
  }));

  const componentsDtsFilePath = config.sys.path.join(config.rootDir, pkgData.types);
  const typesFileExists = await compilerCtx.fs.access(componentsDtsFilePath);
  if (!typesFileExists) {
    const err = buildError(buildCtx.diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "types" file does not exist: ${componentsDtsFilePath}`;
    return;
  }

  // copy the generated components.d.ts file
  try {
    const componentsDtsSrcContent = await compilerCtx.fs.readFile(componentsDtsFilePath);
    await compilerCtx.fs.writeFile(getComponentsDtsDistTypesFilePath(config), componentsDtsSrcContent);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}


export function getComponentsDtsSrcFilePath(config: Config) {
  return pathJoin(config, config.srcDir, COMPONENTS_DTS);
}


export function getComponentsDtsDistTypesFilePath(config: Config) {
  return pathJoin(config, config.typesDir, COMPONENTS_DTS);
}


export const COMPONENTS_DTS = 'components.d.ts';
