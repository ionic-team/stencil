import * as d from '../../declarations';
import { NodeResolveModule } from './node-resolve-module';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';


export class NodeLazyRequire implements d.LazyRequire {
  private moduleData = new Map<string, { fromDir: string, modulePath: string }>();

  constructor(private nodeResolveModule: NodeResolveModule, private semver: d.Semver, private stencilPackageJson: d.PackageJsonData) {
  }

  async ensure(logger: d.Logger, fromDir: string, ensureModuleIds: string[]) {
    if (!this.stencilPackageJson || !this.stencilPackageJson.lazyDependencies) {
      return Promise.resolve();
    }

    if (!this.stencilPackageJson.lazyDependencies) {
      return Promise.resolve();
    }

    const depsToInstall: DepToInstall[] = [];

    const promises = ensureModuleIds.map(async ensureModuleId => {
      const existingModuleData = this.moduleData.get(ensureModuleId);
      if (existingModuleData && existingModuleData.fromDir && existingModuleData.modulePath) {
        return;
      }

      const requiredVersionRange = this.stencilPackageJson.lazyDependencies[ensureModuleId];

      try {
        const resolvedPkgJsonPath = this.nodeResolveModule.resolveModule(fromDir, ensureModuleId);

        const installedPkgJson = await readPackageJson(resolvedPkgJsonPath);

        if (this.semver.satisfies(installedPkgJson.version, requiredVersionRange)) {
          this.moduleData.set(ensureModuleId, {
            fromDir: fromDir,
            modulePath: path.dirname(resolvedPkgJsonPath)
          });
          return;
        }
      } catch (e) {}

      depsToInstall.push({
        moduleId: ensureModuleId,
        requiredVersionRange: requiredVersionRange
      });
    });

    await Promise.all(promises);

    if (depsToInstall.length === 0) {
      return Promise.resolve();
    }

    logger.info(logger.magenta(`Please wait while missing dependencies are installed. This may take a few moments and will only be required for the first time run.`));

    const moduleIds = depsToInstall.map(dep => dep.moduleId);
    const timeSpan = logger.createTimeSpan(`installing dependenc${moduleIds.length > 1 ? 'ies' : 'y'}: ${moduleIds.join(', ')}`);

    try {
      const installModules = depsToInstall.map(dep => {
        let moduleId = dep.moduleId;
        if (dep.requiredVersionRange) {
          moduleId += '@' + dep.requiredVersionRange;
        }
        return moduleId;
      });

      await npmInstall(logger, fromDir, installModules);

      depsToInstall.forEach(installedDep => {
        this.moduleData.set(installedDep.moduleId, {
          fromDir: fromDir,
          modulePath: null
        });
      });

      timeSpan.finish(`installing dependencies finished`);

    } catch (e) {
      logger.error(`lazy require failed: ${e}`);
    }
  }

  require(moduleId: string) {
    const moduleData = this.moduleData.get(moduleId);

    if (!moduleData) {
      throw new Error(`lazy required module has not been ensured: ${moduleId}`);
    }

    if (!moduleData.modulePath) {
      const modulePkgJsonPath = this.nodeResolveModule.resolveModule(moduleData.fromDir, moduleId);
      moduleData.modulePath = path.dirname(modulePkgJsonPath);
      this.moduleData.set(moduleId, moduleData);
    }

    return require(moduleData.modulePath);
  }

  getModulePath(moduleId: string) {
    const moduleData = this.moduleData.get(moduleId);

    if (!moduleData) {
      throw new Error(`lazy required module has not been ensured: ${moduleId}`);
    }

    if (!moduleData.modulePath) {
      const modulePkgJsonPath = this.nodeResolveModule.resolveModule(moduleData.fromDir, moduleId);
      moduleData.modulePath = path.dirname(modulePkgJsonPath);
      this.moduleData.set(moduleId, moduleData);
    }

    return moduleData.modulePath;
  }

}


function npmInstall(logger: d.Logger, fromDir: string, moduleIds: string[]) {
  return new Promise<void>((resolve, reject) => {
    const cmd = 'npm';

    const args = [
      'install',
      ...moduleIds,
      '--no-audit',
      '--save-exact',
      '--save-dev'
    ];

    const opts: cp.SpawnOptions = {
      shell: true,
      cwd: fromDir,
      env: Object.assign({}, process.env)
    };
    opts.env.NODE_ENV = 'development';

    if (logger.level === 'debug') {
      args.push('--verbose');
      opts.stdio = 'inherit';
    }

    logger.debug(`${cmd} ${args.join(' ')}`);
    logger.debug(`${cmd}, cwd: ${fromDir}`);

    const childProcess = cp.spawn(cmd, args, opts);

    let error = '';

    if (childProcess.stderr) {
      childProcess.stderr.on('data', data => {
        error += data.toString();
      });
    }

    childProcess.once('exit', exitCode => {
      if (logger.level === 'debug') {
        logger.debug(`${cmd}, exit ${exitCode}`);
      }

      if (exitCode === 0) {
        resolve();
      } else {
        reject(`failed to install: ${moduleIds.join(', ')}${error ? ', ' + error : ''}`);
      }
    });

  });
}


function readPackageJson(pkgJsonPath: string) {
  return new Promise<d.PackageJsonData>((resolve, reject) => {
    fs.readFile(pkgJsonPath, 'utf8', (err, data) => {
      if (err) {
        reject(err);

      } else {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

interface DepToInstall {
  moduleId: string;
  requiredVersionRange: string;
}
