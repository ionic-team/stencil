import { BuildCtx, CompilerCtx, Config, Diagnostic } from '../../declarations';
import { buildError, buildWarn, normalizePath } from '../util';
import { COLLECTION_MANIFEST_FILE_NAME } from '../../util/constants';
import { copyComponentStyles } from '../copy/copy-styles';
import { getLoaderFileName } from '../app/app-file-naming';
import { pathJoin } from '../util';



export async function generateDistribution(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx): Promise<any> {
  if (!config.generateDistribution) {
    // don't bother
    return;
  }

  await Promise.all([
    copyComponentStyles(config, compilerCtx, buildCtx),
    readPackageJson(config, compilerCtx, buildCtx),
    generateTypes(config, compilerCtx)
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

  const packageJsonData = JSON.parse(packageJsonText);
  validatePackageJson(config, buildCtx.diagnostics, packageJsonData);
}


export function validatePackageJson(config: Config, diagnostics: Diagnostic[], data: any) {
  validatePackageFiles(config, diagnostics, data);

  const mainFileName = getLoaderFileName(config);
  const main = pathJoin(config, config.sys.path.relative(config.rootDir, config.distDir), mainFileName);
  if (!data.main || normalizePath(data.main) !== main) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "main" property is required when generating a distribution and must be set to: ${main}`;
  }

  validatePackageJsonTypes(config, diagnostics, data);

  const collection = pathJoin(config, config.sys.path.relative(config.rootDir, config.collectionDir), COLLECTION_MANIFEST_FILE_NAME);
  if (!data.collection || normalizePath(data.collection) !== collection) {
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


function validatePackageJsonTypes(config: Config, diagnostics: Diagnostic[], data: any) {
  const indexDtsFileAbsPath = config.sys.path.join(config.typesDir, 'index.d.ts');
  const indexDtsFileRelPath = pathJoin(config, config.sys.path.relative(config.rootDir, indexDtsFileAbsPath));
  const componentsDtsFileAbsPath = config.sys.path.join(config.typesDir, COMPONENTS_DTS);
  const componentsDtsFileRelPath = pathJoin(config, config.sys.path.relative(config.rootDir, componentsDtsFileAbsPath));

  if (!data.types || (normalizePath(data.types) !== indexDtsFileRelPath && normalizePath(data.types) !== componentsDtsFileRelPath)) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "types" property is required when generating a distribution. Recommended entry d.ts file is: ${componentsDtsFileRelPath}`;
  }
}


export function validatePackageFiles(config: Config, diagnostics: Diagnostic[], packageJsonData: any) {
  if (packageJsonData.files) {
    const actualDistDir = normalizePath(config.sys.path.relative(config.rootDir, config.distDir));

    const validPaths = [
      `${actualDistDir}`,
      `${actualDistDir}/`,
      `./${actualDistDir}`,
      `./${actualDistDir}/`
    ];

    const containsDistDir = (packageJsonData.files as string[])
            .some(userPath => validPaths.some(validPath => normalizePath(userPath) === validPath));

    if (!containsDistDir) {
      const err = buildError(diagnostics);
      err.header = `package.json error`;
      err.messageText = `package.json "files" array must contain the distribution directory "${actualDistDir}/" when generating a distribution.`;
    }
  }
}


async function generateTypes(config: Config, ctx: CompilerCtx) {

  // If index.d.ts file exists at the root then copy it.
  try {
    const indexDtsSrcFilePath = pathJoin(config, config.srcDir, 'index.d.ts');
    const indexDtsDistTypesFilePath = pathJoin(config, config.typesDir, 'index.d.ts');
    const indexDtsSrcContent = await ctx.fs.readFile(indexDtsSrcFilePath);
    await ctx.fs.writeFile(indexDtsDistTypesFilePath, indexDtsSrcContent);
  } catch (e) {}

  // copy the generated components.d.ts file
  try {
    const componentsDtsSrcContent = await ctx.fs.readFile(getComponentsDtsSrcFilePath(config));
    await ctx.fs.writeFile(getComponentsDtsDistTypesFilePath(config), componentsDtsSrcContent);
  } catch (e) {}
}


export function getComponentsDtsSrcFilePath(config: Config) {
  return pathJoin(config, config.srcDir, COMPONENTS_DTS);
}


export function getComponentsDtsDistTypesFilePath(config: Config) {
  return pathJoin(config, config.typesDir, COMPONENTS_DTS);
}


export const COMPONENTS_DTS = 'components.d.ts';
