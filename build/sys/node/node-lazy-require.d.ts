import type * as d from '../../declarations';
import { NodeResolveModule } from './node-resolve-module';
/**
 * The version range that we support for a given package. The strings should be
 * standard semver strings.
 */
interface DepVersionRange {
    minVersion: string;
    recommendedVersion: string;
    /**
     * Max version is optional because we aren't always worried about upgrades.
     * This should be set for packages where major version upgrades have
     * historically caused problems, or when we've identified a specific issue
     * that requires us to stay at or below a certain version. Note that
     * `NodeLazyRequire.ensure` only checks the major version.
     */
    maxVersion?: string;
}
/**
 * A manifest for lazily-loaded dependencies, mapping dependency names to
 * version ranges.
 */
export type LazyDependencies = Record<string, DepVersionRange>;
/**
 * Lazy requirer for Node, with functionality for specifying version ranges and
 * returning diagnostic errors if requirements aren't met.
 */
export declare class NodeLazyRequire implements d.LazyRequire {
    private nodeResolveModule;
    private lazyDependencies;
    private ensured;
    /**
     * Create a NodeLazyRequire instance
     *
     * @param nodeResolveModule an object which wraps up module resolution functionality
     * @param lazyDependencies the dependency requirements we want to enforce here
     */
    constructor(nodeResolveModule: NodeResolveModule, lazyDependencies: LazyDependencies);
    /**
     * Ensure that a dependency within our supported range is installed in the
     * current environment. This function will check all the dependency
     * requirements passed in when the class is instantiated and return
     * diagnostics if there are any issues.
     *
     * @param fromDir the directory from which we'll attempt to resolve the
     * dependencies, typically this will be project's root directory.
     * @param ensureModuleIds an array of module names whose versions we're going
     * to check
     * @returns a Promise holding diagnostics if any of the dependencies either
     * were not resolved _or_ did not meet our version requirements.
     */
    ensure(fromDir: string, ensureModuleIds: string[]): Promise<d.Diagnostic[]>;
    require(fromDir: string, moduleId: string): any;
    getModulePath(fromDir: string, moduleId: string): string;
}
export {};
