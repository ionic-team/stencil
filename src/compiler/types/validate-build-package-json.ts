import type * as d from '../../declarations';
import { COLLECTION_MANIFEST_FILE_NAME, buildJsonFileError, isGlob, normalizePath, isString } from '@utils';
import { dirname, join, relative } from 'path';
import {
  getComponentsDtsTypesFilePath,
  isOutputTargetDistCollection,
  isOutputTargetDistCustomElementsBundle,
  isOutputTargetDistTypes,
} from '../output-targets/output-utils';

export const validateBuildPackageJson = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (config.watch) {
    return;
  }
  if (buildCtx.packageJson == null) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCollection);
  const typesOutputTargets = config.outputTargets.filter(isOutputTargetDistTypes);
  await Promise.all([
    ...outputTargets.map((outputsTarget) => {
      return validatePackageJsonOutput(config, compilerCtx, buildCtx, outputsTarget);
    }),
    ...typesOutputTargets.map((outputTarget) => {
      return validateTypes(config, compilerCtx, buildCtx, outputTarget);
    }),
  ]);
};

const validatePackageJsonOutput = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistCollection
) => {
  await Promise.all([
    validatePackageFiles(config, compilerCtx, buildCtx, outputTarget),
    validateMain(config, compilerCtx, buildCtx, outputTarget),
    validateModule(config, compilerCtx, buildCtx, outputTarget),
    validateCollection(config, compilerCtx, buildCtx, outputTarget),
    validateBrowser(config, compilerCtx, buildCtx),
  ]);
};

export const validatePackageFiles = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistCollection
) => {
  if (!config.devMode && Array.isArray(buildCtx.packageJson.files)) {
    const actualDistDir = normalizePath(relative(config.rootDir, outputTarget.dir));

    const validPaths = [`${actualDistDir}`, `${actualDistDir}/`, `./${actualDistDir}`, `./${actualDistDir}/`];

    const containsDistDir = buildCtx.packageJson.files.some((userPath) =>
      validPaths.some((validPath) => normalizePath(userPath) === validPath)
    );

    if (!containsDistDir) {
      const msg = `package.json "files" array must contain the distribution directory "${actualDistDir}/" when generating a distribution.`;
      packageJsonWarn(config, compilerCtx, buildCtx, msg, `"files"`);
      return;
    }

    await Promise.all(
      buildCtx.packageJson.files.map(async (pkgFile) => {
        if (!isGlob(pkgFile)) {
          const packageJsonDir = dirname(config.packageJsonFilePath);
          const absPath = join(packageJsonDir, pkgFile);

          const hasAccess = await compilerCtx.fs.access(absPath);
          if (!hasAccess) {
            const msg = `Unable to find "${pkgFile}" within the package.json "files" array.`;
            packageJsonError(config, compilerCtx, buildCtx, msg, `"${pkgFile}"`);
          }
        }
      })
    );
  }
};

export const validateMain = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistCollection
) => {
  const mainAbs = join(outputTarget.dir, 'index.cjs.js');
  const mainRel = relative(config.rootDir, mainAbs);

  if (!isString(buildCtx.packageJson.main) || buildCtx.packageJson.main === '') {
    const msg = `package.json "main" property is required when generating a distribution. It's recommended to set the "main" property to: ${mainRel}`;
    packageJsonWarn(config, compilerCtx, buildCtx, msg, `"main"`);
  } else if (normalizePath(buildCtx.packageJson.main) !== normalizePath(mainRel)) {
    const msg = `package.json "main" property is set to "${buildCtx.packageJson.main}". It's recommended to set the "main" property to: ${mainRel}`;
    packageJsonWarn(config, compilerCtx, buildCtx, msg, `"main"`);
  }
};

export const validateModule = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistCollection
) => {
  const customElementsOutput = config.outputTargets.find(isOutputTargetDistCustomElementsBundle);
  const currentModule = buildCtx.packageJson.module;
  const distAbs = join(outputTarget.dir, 'index.js');
  const distRel = relative(config.rootDir, distAbs);

  let recommendedRelPath = distRel;
  if (customElementsOutput) {
    const customElementsAbs = join(customElementsOutput.dir, 'index.js');
    recommendedRelPath = relative(config.rootDir, customElementsAbs);
  }

  if (!isString(currentModule)) {
    const msg = `package.json "module" property is required when generating a distribution. It's recommended to set the "module" property to: ${recommendedRelPath}`;
    packageJsonWarn(config, compilerCtx, buildCtx, msg, `"module"`);
  } else if (
    normalizePath(currentModule) !== normalizePath(recommendedRelPath) &&
    normalizePath(currentModule) !== normalizePath(distRel)
  ) {
    const msg = `package.json "module" property is set to "${currentModule}". It's recommended to set the "module" property to: ${recommendedRelPath}`;
    packageJsonWarn(config, compilerCtx, buildCtx, msg, `"module"`);
  }
};

export const validateTypes = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistTypes
) => {
  const typesAbs = getComponentsDtsTypesFilePath(outputTarget);
  const recommendedPath = relative(config.rootDir, typesAbs);

  if (!isString(buildCtx.packageJson.types) || buildCtx.packageJson.types === '') {
    const msg = `package.json "types" property is required when generating a distribution. It's recommended to set the "types" property to: ${recommendedPath}`;
    packageJsonWarn(config, compilerCtx, buildCtx, msg, `"types"`);
  } else if (!buildCtx.packageJson.types.endsWith('.d.ts')) {
    const msg = `package.json "types" file must have a ".d.ts" extension: ${buildCtx.packageJson.types}`;
    packageJsonWarn(config, compilerCtx, buildCtx, msg, `"types"`);
  } else {
    const typesFile = join(config.rootDir, buildCtx.packageJson.types);
    const typesFileExists = await compilerCtx.fs.access(typesFile);
    if (!typesFileExists) {
      let msg = `package.json "types" property is set to "${buildCtx.packageJson.types}" but cannot be found.`;
      if (normalizePath(buildCtx.packageJson.types) !== normalizePath(recommendedPath)) {
        msg += ` It's recommended to set the "types" property to: ${recommendedPath}`;
      }
      packageJsonError(config, compilerCtx, buildCtx, msg, `"types"`);
    }
  }
};

export const validateCollection = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistCollection
) => {
  if (outputTarget.collectionDir) {
    const collectionRel = join(relative(config.rootDir, outputTarget.collectionDir), COLLECTION_MANIFEST_FILE_NAME);
    if (!buildCtx.packageJson.collection || normalizePath(buildCtx.packageJson.collection) !== collectionRel) {
      const msg = `package.json "collection" property is required when generating a distribution and must be set to: ${collectionRel}`;
      packageJsonWarn(config, compilerCtx, buildCtx, msg, `"collection"`);
    }
  }
};

export const validateBrowser = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (isString(buildCtx.packageJson.browser)) {
    const msg = `package.json "browser" property is set to "${buildCtx.packageJson.browser}". However, for maximum compatibility with all bundlers it's recommended to not set the "browser" property and instead ensure both "module" and "main" properties are set.`;
    packageJsonWarn(config, compilerCtx, buildCtx, msg, `"browser"`);
  }
};

const packageJsonError = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  msg: string,
  warnKey: string
) => {
  const err = buildJsonFileError(compilerCtx, buildCtx.diagnostics, config.packageJsonFilePath, msg, warnKey);
  err.header = `Package Json`;
  return err;
};

const packageJsonWarn = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  msg: string,
  warnKey: string
) => {
  const warn = buildJsonFileError(compilerCtx, buildCtx.diagnostics, config.packageJsonFilePath, msg, warnKey);
  warn.header = `Package Json`;
  warn.level = 'warn';
  return warn;
};
