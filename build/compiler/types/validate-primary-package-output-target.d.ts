import type * as d from '../../declarations';
/**
 * Contains utility methods that can be used to generate recommended values for a
 * project's `package.json` fields that get validated for output targets designated
 * as `isPrimaryPackageOutputTarget`.
 */
export type PrimaryPackageOutputTargetRecommendedConfig = {
    /**
     * Generates the recommended path for the `module` property based on the output target type,
     * the project's root directory, and the output target's designated output location.
     *
     * @param rootDir The Stencil project's root directory pulled from the validated config.
     * @param outputTargetDir The output directory for the output target's compiled code.
     * @returns The recommended path for the `module` property in a project's `package.json`
     */
    getModulePath?: (rootDir: string, outputTargetDir: string) => string | null;
    /**
     * Generates the recommended path for the `types` property based on the output target type,
     * the project's root directory, and the output target's configuration.
     *
     * @param rootDir The Stencil project's root directory pulled from the validated config.
     * @param outputTargetConfig The output target's config.
     * @returns The recommended path for the `types` property in a project's `package.json`
     */
    getTypesPath?: (rootDir: string, outputTargetConfig: any) => string | null;
};
/**
 * Contains a `PrimaryPackageOutputTargetRecommendedConfig` for each output target
 * that can be marked as `isPrimaryPackageOutputTarget`. Each config defines how
 * it will generate recommended values for certain `package.json` fields.
 */
export declare const PRIMARY_PACKAGE_TARGET_CONFIGS: {
    dist: {
        getModulePath: (rootDir: string, outputTargetDir: string) => string;
        getTypesPath: (rootDir: string, outputTargetConfig: d.OutputTargetDist) => string;
    };
    'dist-collection': {
        getModulePath: (rootDir: string, outputTargetDir: string) => string;
    };
    'dist-custom-elements': {
        getModulePath: (rootDir: string, outputTargetDir: string) => string;
        getTypesPath: (rootDir: string, outputTargetConfig: d.OutputTargetDistCustomElements) => string;
    };
    'dist-types': {
        getTypesPath: (rootDir: string, outputTargetConfig: d.OutputTargetDistTypes) => string;
    };
};
/**
 * Performs validation for specified fields in a Stencil project's
 * `package.json` based on output targets being designated as
 * `isPrimaryPackageOutputTarget`.
 *
 * @param config The Stencil project's config.
 * @param compilerCtx The project's compiler context.
 * @param buildCtx The project's build context.
 */
export declare const validatePrimaryPackageOutputTarget: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => void;
/**
 * Validates the `module` field in a Stencil project's `package.json`. This function performs
 * basic checks for a value to be set for `module` as well as checks that the specified path
 * matches Stencil's recommended value based on the output target the user designated to be used
 * for validation (i.e. `isPrimaryPackageOutputTarget: true`).
 *
 * If a value does not exist or does not match the recommended path, a _warning_ will be logged to
 * the console at build time.
 *
 * @param config The Stencil project's config.
 * @param compilerCtx The project's compiler context.
 * @param buildCtx The project's build context.
 * @param recommendedOutputTargetConfig The config object containing the function to generate the Stencil
 * recommended value for the `module` path based on the output target type.
 * @param targetToValidate The output target to validate against.
 */
export declare const validateModulePath: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, recommendedOutputTargetConfig: PrimaryPackageOutputTargetRecommendedConfig, targetToValidate: d.EligiblePrimaryPackageOutputTarget) => void;
/**
 * Validates the `types` field in a Stencil project's `package.json`. This function performs
 * basic checks for a value to be set for `types` as well as checks that the specified path
 * matches Stencil's recommended value based on the output target the user designated to be used
 * for validation (i.e. `isPrimaryPackageOutputTarget: true`).
 *
 * If a value does not exist or does not match the recommended path, a warning _or_ error will be logged to
 * the console at build time.
 *
 * @param config The Stencil project's config.
 * @param compilerCtx The project's compiler context.
 * @param buildCtx The project's build context.
 * @param recommendedOutputTargetConfig The config object containing the function to generate the Stencil
 * recommended value for the `types` path based on the output target type.
 * @param targetToValidate The output target to validate against.
 */
export declare const validateTypesPath: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, recommendedOutputTargetConfig: PrimaryPackageOutputTargetRecommendedConfig, targetToValidate: d.EligiblePrimaryPackageOutputTarget) => void;
