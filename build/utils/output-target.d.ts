import type * as d from '../declarations';
import { VALID_CONFIG_OUTPUT_TARGETS } from './constants';
export declare const relativeImport: (pathFrom: string, pathTo: string, ext?: string, addPrefix?: boolean) => string;
export declare const getComponentsDtsSrcFilePath: (config: d.ValidatedConfig) => string;
/**
 * Helper to get an appropriate file path for `components.d.ts` for a `"dist"`
 * or `"dist-types"` output target.
 *
 * @param outputTarget the output target of interest
 * @returns a properly-formatted path
 */
export declare const getComponentsDtsTypesFilePath: (outputTarget: Required<d.OutputTargetDist> | d.OutputTargetDistTypes) => string;
export declare const isOutputTargetDist: (o: d.OutputTarget) => o is d.OutputTargetDist;
export declare const isOutputTargetDistCollection: (o: d.OutputTarget) => o is d.OutputTargetDistCollection;
export declare const isOutputTargetDistCustomElements: (o: d.OutputTarget) => o is d.OutputTargetDistCustomElements;
export declare const isOutputTargetCopy: (o: d.OutputTarget) => o is d.OutputTargetCopy;
export declare const isOutputTargetDistLazy: (o: d.OutputTarget) => o is d.OutputTargetDistLazy;
export declare const isOutputTargetDistLazyLoader: (o: d.OutputTarget) => o is d.OutputTargetDistLazyLoader;
export declare const isOutputTargetDistGlobalStyles: (o: d.OutputTarget) => o is d.OutputTargetDistGlobalStyles;
export declare const isOutputTargetHydrate: (o: d.OutputTarget) => o is d.OutputTargetHydrate;
export declare const isOutputTargetCustom: (o: d.OutputTarget) => o is d.OutputTargetCustom;
export declare const isOutputTargetDocs: (o: d.OutputTarget) => o is d.OutputTargetDocsJson | d.OutputTargetDocsCustom | d.OutputTargetDocsReadme | d.OutputTargetDocsVscode;
export declare const isOutputTargetDocsReadme: (o: d.OutputTarget) => o is d.OutputTargetDocsReadme;
export declare const isOutputTargetDocsJson: (o: d.OutputTarget) => o is d.OutputTargetDocsJson;
export declare const isOutputTargetDocsCustom: (o: d.OutputTarget) => o is d.OutputTargetDocsCustom;
export declare const isOutputTargetDocsVscode: (o: d.OutputTarget) => o is d.OutputTargetDocsVscode;
export declare const isOutputTargetWww: (o: d.OutputTarget) => o is d.OutputTargetWww;
export declare const isOutputTargetStats: (o: d.OutputTarget) => o is d.OutputTargetStats;
export declare const isOutputTargetDistTypes: (o: d.OutputTarget) => o is d.OutputTargetDistTypes;
/**
 * Checks whether or not the supplied output target's type matches one of the eligible primary
 * package output target types (i.e. it can have `isPrimaryPackageOutputTarget: true` in its config).
 *
 * @param o The output target to check.
 * @returns Whether the output target type is one of the "primary" output targets.
 */
export declare const isEligiblePrimaryPackageOutputTarget: (o: d.OutputTarget) => o is d.EligiblePrimaryPackageOutputTarget;
/**
 * Retrieve the Stencil component compiler metadata from a collection of Stencil {@link Module}s
 * @param moduleFiles the collection of `Module`s to retrieve the metadata from
 * @returns the metadata, lexicographically sorted by the tag names of the components
 */
export declare const getComponentsFromModules: (moduleFiles: d.Module[]) => d.ComponentCompilerMeta[];
type ValidConfigOutputTarget = (typeof VALID_CONFIG_OUTPUT_TARGETS)[number];
/**
 * Check whether a given output target is a valid one to be set in a Stencil config
 *
 * @param targetType the type which we want to check
 * @returns whether or not the targetType is a valid, configurable output target.
 */
export declare function isValidConfigOutputTarget(targetType: string): targetType is ValidConfigOutputTarget;
export {};
