import type * as d from '../../declarations';
import { buildError } from '@utils';
import { NodeResolveModule } from './node-resolve-module';
import fs from 'graceful-fs';
import path from 'path';
import satisfies from 'semver/functions/satisfies';
import major from 'semver/functions/major';

/**
 * The version range that we support for a given package
 * [0] is the lower end, while [1] is the higher end.
 *
 * These strings should be standard semver strings.
 */
type NodeVersionRange = [string, string];

/**
 * A manifest for lazily-loaded dependencies, mapping dependency names
 * to version ranges.
 */
type LazyDependencies = Record<string, NodeVersionRange>;

/**
 * Lazy requirer for Node, with functionality for specifying version ranges
 * and returning diagnostic errors if requirements aren't met.
 */
export class NodeLazyRequire implements d.LazyRequire {
  private ensured = new Set<string>();

  /**
   * Create a NodeLazyRequire instance
   *
   * @param nodeResolveModule an object which wraps up module resolution functionality
   * @param lazyDependencies the dependency requirements we want to enforce here
   */
  constructor(private nodeResolveModule: NodeResolveModule, private lazyDependencies: LazyDependencies) {}

  /**
   * Ensure that a dependency within our supported range is installed in the current
   * environment. This function will check all the dependency requirements passed in when
   * the class is instantiated and return diagnostics if there are any issues.
   *
   * @param fromDir the directory from which we'll attempt to resolve the dependencies, typically
   * this will be project's root directory.
   * @param ensureModuleIds an array of module names whose versions we're going to check
   * @returns a Promise holding diagnostics if any of the dependencies either were not
   * resolved _or_ did not meet our version requirements.
   */
  async ensure(fromDir: string, ensureModuleIds: string[]): Promise<d.Diagnostic[]> {
    const diagnostics: d.Diagnostic[] = [];
    const problemDeps: string[] = [];

    ensureModuleIds.forEach((ensureModuleId) => {
      if (!this.ensured.has(ensureModuleId)) {
        const [minVersion, maxVersion] = this.lazyDependencies[ensureModuleId];

        try {
          const pkgJsonPath = this.nodeResolveModule.resolveModule(fromDir, ensureModuleId);
          const installedPkgJson: d.PackageJsonData = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

          if (satisfies(installedPkgJson.version, `${minVersion} - ${major(maxVersion)}.x`)) {
            this.ensured.add(ensureModuleId);
            return;
          }
        } catch (e) {}
        // if we get here we didn't get to the `return` above, so either 1) there was some error
        // reading the package.json or 2) the version wasn't in our specified version range.
        problemDeps.push(`${ensureModuleId}@${maxVersion}`);
      }
    });

    if (problemDeps.length > 0) {
      const err = buildError(diagnostics);
      err.header = `Please install supported versions of dev dependencies with either npm or yarn.`;
      err.messageText = `npm install --save-dev ${problemDeps.join(' ')}`;
    }

    return diagnostics;
  }

  require(fromDir: string, moduleId: string) {
    const modulePath = this.getModulePath(fromDir, moduleId);
    return require(modulePath);
  }

  getModulePath(fromDir: string, moduleId: string) {
    const modulePath = this.nodeResolveModule.resolveModule(fromDir, moduleId);
    return path.dirname(modulePath);
  }
}
