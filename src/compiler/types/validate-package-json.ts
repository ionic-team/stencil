import * as d from '../../declarations';
import { COLLECTION_MANIFEST_FILE_NAME, buildJsonFileWarn, normalizePath } from '@utils';
import { getComponentsDtsTypesFilePath, isOutputTargetDistCollection } from '../output-targets/output-utils';


export function validatePackageJson(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.packageJson == null || buildCtx.hasError) {
    return null;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCollection);

  return Promise.all(outputTargets.map(outputsTarget => {
    return validatePackageJsonOutput(config, compilerCtx, buildCtx, outputsTarget);
  }));
}


function validatePackageJsonOutput(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) {
  return Promise.all([
    validatePackageFiles(config, compilerCtx, buildCtx, outputTarget),
    validateMain(config, compilerCtx, buildCtx, outputTarget),
    validateModule(config, compilerCtx, buildCtx, outputTarget),
    validateCollection(config, compilerCtx, buildCtx, outputTarget),
    validateTypes(config, compilerCtx, buildCtx, outputTarget),
    validateTypesExist(config, compilerCtx, buildCtx, outputTarget),
    validateBrowser(compilerCtx, buildCtx)
  ]);
}


export async function validatePackageFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) {
  if (Array.isArray(buildCtx.packageJson.files)) {
    const actualDistDir = normalizePath(config.sys.path.relative(config.rootDir, outputTarget.dir));

    const validPaths = [
      `${actualDistDir}`,
      `${actualDistDir}/`,
      `./${actualDistDir}`,
      `./${actualDistDir}/`
    ];

    const containsDistDir = buildCtx.packageJson.files
            .some(userPath => validPaths.some(validPath => normalizePath(userPath) === validPath));

    if (!containsDistDir) {
      const msg = `package.json "files" array must contain the distribution directory "${actualDistDir}/" when generating a distribution.`;
      packageJsonWarn(compilerCtx, buildCtx, msg, `"files"`);
      return;
    }

    await Promise.all(buildCtx.packageJson.files.map(async pkgFile => {
      const packageJsonDir = config.sys.path.dirname(buildCtx.packageJsonFilePath);
      const absPath = config.sys.path.join(packageJsonDir, pkgFile);
      const hasAccess = await compilerCtx.fs.access(absPath);
      if (!hasAccess) {
        const msg = `Unable to find "${pkgFile}" within the package.json "files" array.`;
        packageJsonWarn(compilerCtx, buildCtx, msg, `"${pkgFile}"`);
      }
    }));
  }
}


export function validateMain(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) {
  const mainAbs = config.sys.path.join(outputTarget.dir, 'index.js');
  const mainRel = normalizePath(config.sys.path.relative(config.rootDir, mainAbs));

  if (typeof buildCtx.packageJson.main !== 'string' || buildCtx.packageJson.main === '') {
    const msg = `package.json "main" property is required when generating a distribution. It's recommended to set the "main" property to: ${mainRel}`;
    packageJsonWarn(compilerCtx, buildCtx, msg, `"main"`);

  } else if (buildCtx.packageJson.main !== mainRel) {
    const msg = `package.json "main" property is set to "${buildCtx.packageJson.main}". It's recommended to set the "main" property to: ${mainRel}`;
    packageJsonWarn(compilerCtx, buildCtx, msg, `"main"`);
  }
}


export function validateModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) {
  const moduleAbs = config.sys.path.join(outputTarget.dir, 'index.mjs');
  const moduleRel = normalizePath(config.sys.path.relative(config.rootDir, moduleAbs));

  if (typeof buildCtx.packageJson.module !== 'string') {
    const msg = `package.json "module" property is required when generating a distribution. It's recommended to set the "module" property to: ${moduleRel}`;
    packageJsonWarn(compilerCtx, buildCtx, msg, `"module"`);

  } else if (buildCtx.packageJson.module !== moduleRel) {
    const msg = `package.json "module" property is set to "${buildCtx.packageJson.module}". It's recommended to set the "module" property to: ${moduleRel}`;
    packageJsonWarn(compilerCtx, buildCtx, msg, `"module"`);
  }
}


export function validateTypes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) {
  if (typeof buildCtx.packageJson.types !== 'string' || buildCtx.packageJson.types === '') {
    const recommendedPath = getRecommendedTypesPath(config, outputTarget);
    const msg = `package.json "types" property is required when generating a distribution. It's recommended to set the "types" property to: ${recommendedPath}`;
    packageJsonWarn(compilerCtx, buildCtx, msg, `"types"`);

  } else if (!buildCtx.packageJson.types.endsWith('.d.ts')) {
    const msg  = `package.json "types" file must have a ".d.ts" extension: ${buildCtx.packageJson.types}`;
    packageJsonWarn(compilerCtx, buildCtx, msg, `"types"`);
  }
}


export async function validateTypesExist(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) {
  if (typeof buildCtx.packageJson.types !== 'string') {
    return;
  }

  const pkgFile = config.sys.path.join(config.rootDir, buildCtx.packageJson.types);
  const fileExists = await compilerCtx.fs.access(pkgFile);
  if (!fileExists) {
    const recommendedPath = getRecommendedTypesPath(config, outputTarget);
    let msg = `package.json "types" property is set to "${buildCtx.packageJson.types}" but cannot be found.`;
    if (buildCtx.packageJson.types !== recommendedPath) {
      msg += ` It's recommended to set the "types" property to: ${recommendedPath}`;
    }
    packageJsonWarn(compilerCtx, buildCtx, msg, `"types"`);
  }
}


export function validateCollection(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) {
  if (outputTarget.collectionDir) {
    const collectionRel = config.sys.path.join(config.sys.path.relative(config.rootDir, outputTarget.collectionDir), COLLECTION_MANIFEST_FILE_NAME);
    if (!buildCtx.packageJson.collection || normalizePath(buildCtx.packageJson.collection) !== collectionRel) {
      const msg = `package.json "collection" property is required when generating a distribution and must be set to: ${collectionRel}`;
      packageJsonWarn(compilerCtx, buildCtx, msg, `"collection"`);
    }
  }
}


export function validateBrowser(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (typeof buildCtx.packageJson.browser === 'string') {
    const msg = `package.json "browser" property is set to "${buildCtx.packageJson.browser}". However, for maximum compatibility with all bundlers it's recommended to not set the "browser" property and instead ensure both "module" and "main" properties are set.`;
    packageJsonWarn(compilerCtx, buildCtx, msg, `"browser"`);
  }
}


export function getRecommendedTypesPath(config: d.Config, outputTarget: d.OutputTargetDistCollection) {
  const typesAbs = getComponentsDtsTypesFilePath(config, outputTarget);
  return normalizePath(config.sys.path.relative(config.rootDir, typesAbs));
}


function packageJsonWarn(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, msg: string, warnKey: string) {
  const warn = buildJsonFileWarn(compilerCtx, buildCtx.diagnostics, buildCtx.packageJsonFilePath, msg, warnKey);
  warn.header = `Package Json`;
  return warn;
}
