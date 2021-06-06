import type * as d from '../../declarations';
import { buildError } from '@utils';
import { NodeResolveModule } from './node-resolve-module';
import semiver from 'semiver';
import fs from 'graceful-fs';
import path from 'path';

export class NodeLazyRequire implements d.LazyRequire {
  private ensured = new Set<string>();

  constructor(
    private nodeResolveModule: NodeResolveModule,
    private lazyDependencies: { [dep: string]: [string, string] },
  ) {}

  async ensure(fromDir: string, ensureModuleIds: string[]) {
    const diagnostics: d.Diagnostic[] = [];
    const missingDeps: string[] = [];

    ensureModuleIds.forEach(ensureModuleId => {
      if (!this.ensured.has(ensureModuleId)) {
        const [minVersion, recommendedVersion] = this.lazyDependencies[ensureModuleId];
        try {
          const pkgJsonPath = this.nodeResolveModule.resolveModule(fromDir, ensureModuleId);

          const installedPkgJson: d.PackageJsonData = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

          if (semiver(installedPkgJson.version, minVersion) >= 0) {
            this.ensured.add(ensureModuleId);
            return;
          }
        } catch (e) {}
        missingDeps.push(`${ensureModuleId}@${recommendedVersion}`);
      }
    });

    if (missingDeps.length > 0) {
      const err = buildError(diagnostics);
      err.header = `Please install missing dev dependencies with either npm or yarn.`;
      err.messageText = `npm install --save-dev ${missingDeps.join(' ')}`;
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
