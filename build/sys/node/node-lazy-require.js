import { buildError } from '@utils';
import fs from 'graceful-fs';
import path from 'path';
import semverLte from 'semver/functions/lte';
import major from 'semver/functions/major';
import satisfies from 'semver/functions/satisfies';
/**
 * Lazy requirer for Node, with functionality for specifying version ranges and
 * returning diagnostic errors if requirements aren't met.
 */
export class NodeLazyRequire {
    /**
     * Create a NodeLazyRequire instance
     *
     * @param nodeResolveModule an object which wraps up module resolution functionality
     * @param lazyDependencies the dependency requirements we want to enforce here
     */
    constructor(nodeResolveModule, lazyDependencies) {
        this.nodeResolveModule = nodeResolveModule;
        this.lazyDependencies = lazyDependencies;
        this.ensured = new Set();
    }
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
    async ensure(fromDir, ensureModuleIds) {
        const diagnostics = [];
        const problemDeps = [];
        ensureModuleIds.forEach((ensureModuleId) => {
            if (!this.ensured.has(ensureModuleId)) {
                const { minVersion, recommendedVersion, maxVersion } = this.lazyDependencies[ensureModuleId];
                try {
                    const pkgJsonPath = this.nodeResolveModule.resolveModule(fromDir, ensureModuleId);
                    const installedPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
                    const installedVersionIsGood = maxVersion
                        ? // if maxVersion, check that `minVersion <= installedVersion <= maxVersion`
                            satisfies(installedPkgJson.version, `${minVersion} - ${major(maxVersion)}.x`)
                        : // else, just check that `minVersion <= installedVersion`
                            semverLte(minVersion, installedPkgJson.version);
                    if (installedVersionIsGood) {
                        this.ensured.add(ensureModuleId);
                        return;
                    }
                }
                catch (e) { }
                // if we get here we didn't get to the `return` above, so either 1) there was some error
                // reading the package.json or 2) the version wasn't in our specified version range.
                problemDeps.push(`${ensureModuleId}@${recommendedVersion}`);
            }
        });
        if (problemDeps.length > 0) {
            const err = buildError(diagnostics);
            err.header = `Please install supported versions of dev dependencies with either npm or yarn.`;
            err.messageText = `npm install --save-dev ${problemDeps.join(' ')}`;
        }
        return diagnostics;
    }
    require(fromDir, moduleId) {
        const modulePath = this.getModulePath(fromDir, moduleId);
        return require(modulePath);
    }
    getModulePath(fromDir, moduleId) {
        const modulePath = this.nodeResolveModule.resolveModule(fromDir, moduleId);
        return path.dirname(modulePath);
    }
}
//# sourceMappingURL=node-lazy-require.js.map