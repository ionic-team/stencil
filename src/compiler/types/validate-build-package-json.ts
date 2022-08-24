import type * as d from '../../declarations';
import { COLLECTION_MANIFEST_FILE_NAME, buildJsonFileError, isGlob, normalizePath, isString } from '@utils';
import { dirname, join, relative } from 'path';
import {
  getComponentsDtsTypesFilePath,
  isOutputTargetDistCollection,
  isOutputTargetDistCustomElements,
  isOutputTargetDistCustomElementsBundle,
  isOutputTargetDistTypes,
} from '../output-targets/output-utils';

/**
 * Validate the package.json file for a project, checking that various fields
 * are set correctly for the currently-configured output targets.
 *
 * @param config the project's Stencil config
 * @param compilerCtx the compiler context
 * @param buildCtx the build context
 * @returns an empty Promise
 */
export const validateBuildPackageJson = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx
): Promise<void> => {
  if (config.watch) {
    return;
  }
  if (buildCtx.packageJson == null) {
    return;
  }

  const distCollectionOutputTargets = config.outputTargets.filter(isOutputTargetDistCollection);
  const typesOutputTargets = config.outputTargets.filter(isOutputTargetDistTypes);
  await Promise.all([
    ...distCollectionOutputTargets.map((distCollectionOT) =>
      validateDistCollectionPkgJson(config, compilerCtx, buildCtx, distCollectionOT)
    ),
    ...typesOutputTargets.map((typesOT) => validateTypes(config, compilerCtx, buildCtx, typesOT)),
    validateModule(config, compilerCtx, buildCtx),
  ]);
};

/**
 * Validate package.json contents for the `DIST_COLLECTION` output target,
 * checking that various fields like `files`, `main`, and so on are set
 * correctly.
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param outputTarget a DIST_COLLECTION output target
 */
const validateDistCollectionPkgJson = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistCollection
) => {
  await Promise.all([
    validatePackageFiles(config, compilerCtx, buildCtx, outputTarget),
    validateMain(config, compilerCtx, buildCtx, outputTarget),
    validateCollection(config, compilerCtx, buildCtx, outputTarget),
    validateBrowser(config, compilerCtx, buildCtx),
  ]);
};

/**
 * Validate that the `files` field in `package.json` contains directories and
 * files that are necessary for the `DIST_COLLECTION` output target.
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param outputTarget a DIST_COLLECTION output target
 */
export const validatePackageFiles = async (
  config: d.ValidatedConfig,
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

/**
 * Check that the `main` field is set correctly in `package.json` for the
 * `DIST_COLLECTION` output target.
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param outputTarget a DIST_COLLECTION output target
 */
export const validateMain = (
  config: d.ValidatedConfig,
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

/**
 * Validate the package.json 'module' field, taking into account output targets
 * and other configuration details. This will look for a value for the `module`
 * field. If not present it will set a relevant warning message with an
 * output-target specific recommended value. If it is present and is not equal
 * to that recommended value it will set a different warning message.
 *
 * @param config the project's Stencil config
 * @param compilerCtx the compiler context
 * @param buildCtx the build context
 * @returns an empty Promise
 */
export const validateModule = async (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const currentModule = buildCtx.packageJson.module;

  const recommendedRelPath = recommendedModulePath(config);

  if (!isString(currentModule)) {
    let msg = 'package.json "module" property is required when generating a distribution.';

    if (recommendedRelPath !== null) {
      msg += ` It's recommended to set the "module" property to: ${normalizePath(recommendedRelPath)}`;
    }
    packageJsonWarn(config, compilerCtx, buildCtx, msg, `"module"`);
    return;
  }

  if (recommendedRelPath !== null && normalizePath(recommendedRelPath) !== normalizePath(currentModule)) {
    const msg = `package.json "module" property is set to "${currentModule}". It's recommended to set the "module" property to: ${normalizePath(
      recommendedRelPath
    )}`;
    packageJsonWarn(config, compilerCtx, buildCtx, msg, `"module"`);
  }
};

// TODO(STENCIL-516): Investigate the hierarchy of these output targets
/**
 * Get the recommended `"module"` path for `package.json` given the output
 * targets that a user has set on their config.
 *
 * @param config the project's Stencil config
 * @returns a recommended module path or a null value to indicate no default
 * value is supplied
 */
function recommendedModulePath(config: d.ValidatedConfig): string | null {
  const customElementsBundleOT = config.outputTargets.find(isOutputTargetDistCustomElementsBundle);
  const customElementsOT = config.outputTargets.find(isOutputTargetDistCustomElements);
  const distCollectionOT = config.outputTargets.find(isOutputTargetDistCollection);

  if (distCollectionOT) {
    return relative(config.rootDir, join(distCollectionOT.dir, 'index.js'));
  }

  if (customElementsOT) {
    const componentsIndexAbs = join(customElementsOT.dir, 'index.js');
    return relative(config.rootDir, componentsIndexAbs);
  }

  if (customElementsBundleOT) {
    const customElementsAbs = join(customElementsBundleOT.dir, 'index.js');
    return relative(config.rootDir, customElementsAbs);
  }

  // if no output target for which we define a recommended output target is set
  // we return `null`
  return null;
}

/**
 * Check that the `types` field is set correctly in `package.json` for the
 * `DIST_COLLECTION` output target.
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param outputTarget a DIST_COLLECTION output target
 */
export const validateTypes = async (
  config: d.ValidatedConfig,
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

/**
 * Check that the `collection` field is set correctly in `package.json` for the
 * `DIST_COLLECTION` output target.
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param outputTarget a DIST_COLLECTION output target
 */
export const validateCollection = (
  config: d.ValidatedConfig,
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

/**
 * Check that the `browser` field is set correctly in `package.json` for the
 * `DIST_COLLECTION` output target.
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 */
export const validateBrowser = (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (isString(buildCtx.packageJson.browser)) {
    const msg = `package.json "browser" property is set to "${buildCtx.packageJson.browser}". However, for maximum compatibility with all bundlers it's recommended to not set the "browser" property and instead ensure both "module" and "main" properties are set.`;
    packageJsonWarn(config, compilerCtx, buildCtx, msg, `"browser"`);
  }
};

/**
 * Build a diagnostic for an error resulting from a particular field in a
 * package.json file
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param msg an error string
 * @param jsonField the key for the field which caused the error, used for
 * finding the error line in the original JSON file
 * @returns a diagnostic object
 */
const packageJsonError = (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  msg: string,
  jsonField: string
): d.Diagnostic => {
  const err = buildJsonFileError(compilerCtx, buildCtx.diagnostics, config.packageJsonFilePath, msg, jsonField);
  err.header = `Package Json`;
  return err;
};

/**
 * Build a diagnostic for a warning resulting from a particular field in a
 * package.json file
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param msg an error string
 * @param jsonField the key for the field which caused the error, used for
 * finding the error line in the original JSON file
 * @returns a diagnostic object
 */
const packageJsonWarn = (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  msg: string,
  jsonField: string
): d.Diagnostic => {
  const warn = buildJsonFileError(compilerCtx, buildCtx.diagnostics, config.packageJsonFilePath, msg, jsonField);
  warn.header = `Package Json`;
  warn.level = 'warn';
  return warn;
};
