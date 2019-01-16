import * as d from '../../declarations';
import color from 'ansi-colors';
import { createContext, runInContext } from './node-context';
import { createFsWatcher } from './node-fs-watcher';
import { createDom } from './node-dom';
import glob from 'glob';
import { loadConfigFile } from './node-config';
import { NodeFs } from './node-fs';
import { NodeLazyRequire } from './node-lazy-require';
import { NodeResolveModule } from './node-resolve-module';
import { NodeRollup } from './node-rollup';
import { NodeStorage } from './node-storage';
import { normalizePath } from '@stencil/core/utils';
import opn from 'opn';
import semver from 'semver';
import { WorkerManager } from './worker/index';


import { createHash } from 'crypto';
import { cpus, platform, release, tmpdir } from 'os';
import * as path from 'path';
import * as url from 'url';


export class NodeSystem implements d.StencilSystem {
  private packageJsonData: d.PackageJsonData;
  private distDir: string;
  private packageDir: string;
  private sysWorker: WorkerManager;
  private typescriptPackageJson: d.PackageJsonData;
  private destroys: Function[] = [];
  private nodeLazyRequire: NodeLazyRequire;
  private nodeResolveModule: NodeResolveModule;
  storage: NodeStorage;

  fs: d.FileSystem;
  path: d.Path;

  semver: d.Semver = {
    lt: semver.lt,
    lte: semver.lte,
    gt: semver.gt,
    gte: semver.gte,
    prerelease: semver.prerelease,
    satisfies: semver.satisfies
  };

  constructor(fs?: d.FileSystem) {
    this.fs = fs || new NodeFs();
    this.path = path;
    this.nodeResolveModule = new NodeResolveModule();
    this.storage = new NodeStorage(this.fs);

    this.packageDir = path.join(__dirname, '..', '..', '..');
    this.distDir = path.join(this.packageDir, 'dist');

    try {
      this.packageJsonData = require(path.join(this.packageDir, 'package.json'));
    } catch (e) {
      throw new Error(`unable to resolve "package.json" from: ${this.packageDir}`);
    }

    try {
      this.typescriptPackageJson = require(this.resolveModule(this.packageDir, 'typescript')) as d.PackageJsonData;
    } catch (e) {
      throw new Error(`unable to resolve "typescript" from: ${this.packageDir}`);
    }
  }

  initWorkers(maxConcurrentWorkers: number, maxConcurrentTasksPerWorker: number) {
    if (this.sysWorker) {
      return this.sysWorker.options;
    }
    const workerModulePath = require.resolve(path.join(this.distDir, 'sys', 'node', 'sys-worker.js'));

    const availableCpus = cpus().length;
    if (typeof maxConcurrentWorkers === 'number') {
      maxConcurrentWorkers = Math.max(1, Math.min(availableCpus, maxConcurrentWorkers));
    } else {
      maxConcurrentWorkers = availableCpus;
    }

    this.sysWorker = new WorkerManager(workerModulePath, {
      maxConcurrentWorkers: maxConcurrentWorkers,
      maxConcurrentTasksPerWorker: maxConcurrentTasksPerWorker
    });

    this.addDestroy(() => {
      if (this.sysWorker) {
        this.sysWorker.destroy();
      }
    });

    return this.sysWorker.options;
  }

  cancelWorkerTasks() {
    if (this.sysWorker) {
      this.sysWorker.cancelTasks();
    }
  }

  destroy() {
    this.destroys.forEach(destroyFn => {
      destroyFn();
    });
    this.destroys.length = 0;
  }

  addDestroy(fn: Function) {
    this.destroys.push(fn);
  }

  get compiler() {
    return {
      name: this.packageJsonData.name,
      version: this.packageJsonData.version,
      runtime: path.join(this.distDir, 'compiler', 'index.js'),
      packageDir: this.packageDir,
      distDir: this.distDir,
      typescriptVersion: this.typescriptPackageJson.version
    };
  }

  async copy(copyTasks: d.CopyTask[]): Promise<d.CopyResults> {
    return this.sysWorker.run('copy', [copyTasks], { isLongRunningTask: true });
  }

  private _existingDom: () => d.CreateDom;

  get createDom() {
    if (this._existingDom) {
      return this._existingDom;
    }
    return createDom;
  }

  set createDom(val) {
    this._existingDom = val;
  }

  createFsWatcher(events: d.BuildEvents, paths: string, opts: any) {
    const fsWatcher = createFsWatcher(events, paths, opts);

    this.addDestroy(() => {
      fsWatcher.close();
    });

    return fsWatcher;
  }

  generateContentHash(content: any, length: number) {
    let hash = createHash('md5')
               .update(content)
               .digest('base64');

    if (typeof length === 'number') {
      hash = hash.replace(/\W/g, '')
                 .substr(0, length)
                 .toLowerCase();
    }

    return hash;
  }

  getClientCoreFile(opts: any) {
    const filePath = normalizePath(path.join(this.distDir, 'client', opts.staticName));
    return this.fs.readFile(filePath);
  }

  glob(pattern: string, opts: any) {
    return new Promise<string[]>((resolve, reject) => {
      glob(pattern, opts, (err: any, files: string[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }

  loadConfigFile(configPath: string, process?: NodeJS.Process) {
    const config = loadConfigFile(this.fs, configPath, process);

    if (!config.sys) {
      config.sys = this;
    }

    return config;
  }

  get lazyRequire() {
    if (!this.nodeLazyRequire) {
      this.nodeLazyRequire = new NodeLazyRequire(this.semver, this.nodeResolveModule, this.packageJsonData);
    }
    return this.nodeLazyRequire;
  }

  optimizeCss(inputOpts: d.OptimizeCssInput) {
    return this.sysWorker.run('optimizeCss', [inputOpts]);
  }

  minifyJs(input: string, opts?: any) {
    return this.sysWorker.run('minifyJs', [input, opts]);
  }

  open(target: string, opts: any) {
    return opn(target, opts) as Promise<any>;
  }

  get details() {
    const details: d.SystemDetails = {
      cpuModel: '',
      cpus: -1,
      platform: '',
      release: '',
      runtime: 'node',
      runtimeVersion: '',
      tmpDir: tmpdir()
    };
    try {
      const sysCpus = cpus();
      details.cpuModel = sysCpus[0].model;
      details.cpus = sysCpus.length;
      details.platform = platform();
      details.release = release();
      details.runtimeVersion = process.version;
    } catch (e) {}
    return details;
  }

  requestLatestCompilerVersion() {
    return this.sysWorker.run('requestLatestCompilerVersion');
  }

  resolveModule(fromDir: string, moduleId: string, opts?: d.ResolveModuleOptions) {
    return this.nodeResolveModule.resolveModule(fromDir, moduleId, opts);
  }

  get rollup() {
    return NodeRollup;
  }

  scopeCss(cssText: string, scopeId: string, hostScopeId: string, slotScopeId: string) {
    return this.sysWorker.run('scopeCss', [cssText, scopeId, hostScopeId, slotScopeId]);
  }

  get color() {
    return color;
  }

  async transpileToEs5(cwd: string, input: string, inlineHelpers: boolean) {
    return this.sysWorker.run('transpileToEs5', [cwd, input, inlineHelpers]);
  }

  get url() {
    return url;
  }

  validateTypes(compilerOptions: any, emitDtsFiles: boolean, currentWorkingDir: string, collectionNames: string[], rootTsFiles: string[]) {
    return this.sysWorker.run(
      'validateTypes',
      [compilerOptions, emitDtsFiles, currentWorkingDir, collectionNames, rootTsFiles],
      { isLongRunningTask: true, workerKey: 'validateTypes' }
    );
  }

  get vm(): any {
    return {
      createContext,
      runInContext
    };
  }

}
