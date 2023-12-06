import type * as d from '../../../declarations';
export declare const generateLazyModules: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargetType: string, destinations: string[], results: d.RollupResult[], sourceTarget: d.SourceTarget, isBrowserBuild: boolean, sufix: string) => Promise<d.BundleModule[]>;
/**
 * Sorts bundle modules by the number of dependents, dependencies, and containing component tags.
 * Dependencies/dependents may also include components that are statically slotted into other components.
 * The order of the bundle modules is important because it determines the order in which the bundles are loaded
 * and subsequently the order that their respective components are defined and connected (i.e. via the `connectedCallback`)
 * at runtime.
 *
 * This must be a valid {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn | compareFn}
 *
 * @param a The first argument to compare.
 * @param b The second argument to compare.
 * @returns A number indicating whether the first argument is less than/greater than/equal to the second argument.
 */
export declare const sortBundleModules: (a: d.BundleModule, b: d.BundleModule) => -1 | 1 | 0;
export declare const sortBundleComponents: (a: d.ComponentCompilerMeta, b: d.ComponentCompilerMeta) => -1 | 1 | 0;
