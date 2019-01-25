import * as d from '@declarations';
import { buildWarn, normalizePath } from '@utils';
import { COLLECTION_MANIFEST_FILE_NAME } from '@utils';
import { getComponentsDtsTypesFilePath, getDistCjsIndexPath, getDistEsmIndexPath, getLoaderPath } from '../output-targets/output-file-naming';
import { sys } from '@sys';


export function validatePackageFiles(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  if (Array.isArray(pkgData.files)) {
    const actualDistDir = normalizePath(sys.path.relative(config.rootDir, outputTarget.dir));

    const validPaths = [
      `${actualDistDir}`,
      `${actualDistDir}/`,
      `./${actualDistDir}`,
      `./${actualDistDir}/`
    ];

    const containsDistDir = pkgData.files
            .some(userPath => validPaths.some(validPath => normalizePath(userPath) === validPath));

    if (!containsDistDir) {
      const err = buildWarn(diagnostics);
      err.messageText = `package.json "files" array must contain the distribution directory "${actualDistDir}/" when generating a distribution.`;
    }
  }
}


export async function validateModule(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  const moduleAbs = getDistEsmIndexPath(config, outputTarget, 'es5');
  const moduleRel = normalizePath(sys.path.relative(config.rootDir, moduleAbs));

  if (typeof pkgData.module !== 'string') {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "module" property is required when generating a distribution. It's recommended to set the "module" property to: ${moduleRel}`;
    return;
  }

  // Check for not recommended values
  if (pkgData.module.endsWith('collection/index.js')) {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "module" property is set to "${pkgData.module}" but it's not recommended since it might point to non-ES5 code. It's recommended to set the "module" property to: ${moduleRel}`;
    return;
  }

  const pkgFile = normalizePath(config.rootDir, pkgData.module);
  const fileExists = await compilerCtx.fs.access(pkgFile);
  if (!fileExists) {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "module" property is set to "${pkgData.module}" but cannot be found. It's recommended to set the "module" property to: ${moduleRel}`;
    return;
  }
}


export async function validateMain(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  const mainAbs = getDistCjsIndexPath(config, outputTarget);
  const mainRel = normalizePath(sys.path.relative(config.rootDir, mainAbs));

  if (typeof pkgData.main !== 'string' || pkgData.main === '') {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "main" property is required when generating a distribution. It's recommended to set the "main" property to: ${mainRel}`;
    return;
  }

  const pkgFile = normalizePath(config.rootDir, pkgData.main);
  const fileExists = await compilerCtx.fs.access(pkgFile);
  if (!fileExists) {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "main" property is set to "${pkgData.main}" but cannot be found. It's recommended to set the "main" property to: ${mainRel}`;
    return;
  }

  const loaderAbs = getLoaderPath(config, outputTarget);
  const loaderRel = normalizePath(sys.path.relative(config.rootDir, loaderAbs));
  if (normalizePath(pkgData.main) === loaderRel) {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "main" property should not be set to "${pkgData.main}", which is the browser loader (this was a previous recommendation, but recently updated). Instead, please set the "main" property to: ${mainRel}`;
    return;
  }
}


export function validateTypes(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  if (typeof pkgData.types !== 'string' || pkgData.types === '') {
    const err = buildWarn(diagnostics);
    const recommendedPath = getRecommendedTypesPath(config, outputTarget);
    err.messageText = `package.json "types" property is required when generating a distribution. It's recommended to set the "types" property to: ${recommendedPath}`;
    return false;
  }

  if (!pkgData.types.endsWith('.d.ts')) {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "types" file must have a ".d.ts" extension: ${pkgData.types}`;
    return false;
  }
  return true;
}


export async function validateTypesExist(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  const pkgFile = sys.path.join(config.rootDir, pkgData.types);
  const fileExists = await compilerCtx.fs.access(pkgFile);
  if (!fileExists) {
    const err = buildWarn(diagnostics);
    const recommendedPath = getRecommendedTypesPath(config, outputTarget);
    err.messageText = `package.json "types" property is set to "${pkgData.types}" but cannot be found. It's recommended to set the "types" property to: ${recommendedPath}`;
    return false;
  }

  return true;
}


export function validateCollection(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  if (outputTarget.collectionDir) {
    const collectionRel = normalizePath(sys.path.relative(config.rootDir, outputTarget.collectionDir), COLLECTION_MANIFEST_FILE_NAME);
    if (!pkgData.collection || normalizePath(pkgData.collection) !== collectionRel) {
      const err = buildWarn(diagnostics);
      err.messageText = `package.json "collection" property is required when generating a distribution and must be set to: ${collectionRel}`;
    }
  }
}


export function validateBrowser(diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  if (typeof pkgData.browser === 'string') {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "browser" property is set to "${pkgData.browser}". However, for maximum compatibility with all bundlers it's recommended to not set the "browser" property and instead ensure both "module" and "main" properties are set.`;
  }
}


export function validateNamespace(config: d.Config, diagnostics: d.Diagnostic[]) {
  if (typeof config.namespace !== 'string' || config.fsNamespace === 'app') {
    const err = buildWarn(diagnostics);
    err.messageText = `When generating a distribution it is recommended to choose a unique namespace rather than the default setting "App". Please updated the "namespace" config property within the stencil.config.js file.`;
  }
}


export function getRecommendedTypesPath(config: d.Config, outputTarget: d.OutputTargetDist) {
  const typesAbs = getComponentsDtsTypesFilePath(config, outputTarget);
  return normalizePath(sys.path.relative(config.rootDir, typesAbs));
}
