import { BuildConditionals, BuildFeatures, ComponentCompilerMeta, ModuleMap, ValidatedConfig } from '@stencil/core/internal';
/**
 * Re-export {@link BUILD} defaults
 */
export * from '../../app-data';
/**
 * Generate a {@link BuildFeatures} entity, based on the provided component metadata
 * @param cmps a collection of component compiler metadata, used to set values on the generated build features object
 * @returns the generated build features entity
 */
export declare const getBuildFeatures: (cmps: ComponentCompilerMeta[]) => BuildFeatures;
export declare const updateComponentBuildConditionals: (moduleMap: ModuleMap, cmps: ComponentCompilerMeta[]) => void;
/**
 * Update the provided build conditionals object in-line with a provided Stencil project configuration
 *
 * **This function mutates the build conditionals argument**
 *
 * @param config the Stencil configuration to use to update the provided build conditionals
 * @param b the build conditionals to update
 */
export declare const updateBuildConditionals: (config: ValidatedConfig, b: BuildConditionals) => void;
