import * as d from '../../declarations';
import { COLLECTION_MANIFEST_FILE_NAME, buildWarn, normalizePath } from '@utils';
import { getComponentsDtsTypesFilePath } from '../output-targets/output-utils';


export function validatePackageFiles(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  if (Array.isArray(pkgData.files)) {
    const actualDistDir = normalizePath(config.sys.path.relative(config.rootDir, outputTarget.dir));

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


export function validateModule(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  const moduleAbs = config.sys.path.join(outputTarget.dir, 'index.mjs');
  const moduleRel = normalizePath(config.sys.path.relative(config.rootDir, moduleAbs));

  if (typeof pkgData.module !== 'string') {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "module" property is required when generating a distribution. It's recommended to set the "module" property to: ${moduleRel}`;
    return;
  }

  // Check for not recommended values
  if (pkgData.module !== moduleRel) {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "module" property is set to "${pkgData.module}". It's recommended to set the "module" property to: ${moduleRel}`;
    return;
  }
}

export function validateCollectionMain(config: d.Config, outputTarget: d.OutputTargetDistCollection, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  const moduleAbs = config.sys.path.join(outputTarget.collectionDir, 'index.js');
  const moduleRel = normalizePath(config.sys.path.relative(config.rootDir, moduleAbs));

  if (typeof pkgData['collection:main'] !== 'string') {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "collection:main" property is recommended when generating a distribution. It's recommended to set the "collection:main" property to: ${moduleRel}`;
    return;
  }

  // Check for not recommended values
  if (pkgData.module !== moduleRel) {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "collection:main" property is set to "${pkgData['collection:main']}". It's recommended to set the "collection:main" property to: ${moduleRel}`;
    return;
  }
}

export function validateMain(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  const mainAbs = config.sys.path.join(outputTarget.dir, 'index.js');
  const mainRel = normalizePath(config.sys.path.relative(config.rootDir, mainAbs));

  if (typeof pkgData.main !== 'string' || pkgData.main === '') {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "main" property is required when generating a distribution. It's recommended to set the "main" property to: ${mainRel}`;
    return;
  }

  if (pkgData.main !== mainRel) {
    const err = buildWarn(diagnostics);
    err.messageText = `package.json "main" property is set to "${pkgData.module}". It's recommended to set the "main" property to: ${mainRel}`;
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
  if (typeof pkgData.types !== 'string') {
    return false;
  }

  const pkgFile = config.sys.path.join(config.rootDir, pkgData.types);
  const fileExists = await compilerCtx.fs.access(pkgFile);
  if (!fileExists) {
    const err = buildWarn(diagnostics);
    const recommendedPath = getRecommendedTypesPath(config, outputTarget);
    err.messageText = `package.json "types" property is set to "${pkgData.types}" but cannot be found.`;
    if (pkgData.types !== recommendedPath) {
      err.messageText += ` It's recommended to set the "types" property to: ${recommendedPath}`;
    }
    return false;
  }

  return true;
}


export function validateCollection(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  if (outputTarget.collectionDir) {
    const collectionRel = config.sys.path.join(config.sys.path.relative(config.rootDir, outputTarget.collectionDir), COLLECTION_MANIFEST_FILE_NAME);
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


export function getRecommendedTypesPath(config: d.Config, outputTarget: d.OutputTargetDist) {
  const typesAbs = getComponentsDtsTypesFilePath(config, outputTarget);
  return normalizePath(config.sys.path.relative(config.rootDir, typesAbs));
}
