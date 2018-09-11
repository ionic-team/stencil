import * as d from '../../declarations';
import { createContext, runInContext } from './node-context';
import { createFsWatcher } from './node-fs-watcher';
import { createDom } from './node-dom';
import { loadConfigFile } from './node-config';
import { NodeFs } from './node-fs';
import { NodeLazyRequire } from './node-lazy-require';
import { NodeResolveModule } from './node-resolve-module';
import { NodeStorage } from './node-storage';
import { normalizePath } from '../../compiler/util';
import { WorkerManager } from './worker/index';

import * as crypto from 'crypto';
import * as os from 'os';
import * as path from 'path';
import * as url from 'url';


export class NodeSystem implements d.StencilSystem {
  private packageJsonData: d.PackageJsonData;
  private distDir: string;
  private packageDir: string;
  private sysUtil: any;
  private sysWorker: WorkerManager;
  private typescriptPackageJson: d.PackageJsonData;
  private destroys: Function[] = [];
  private nodeLazyRequire: NodeLazyRequire;
  private nodeResolveModule: NodeResolveModule;
  storage: NodeStorage;

  fs: d.FileSystem;
  path: d.Path;

  constructor(fs?: d.FileSystem) {
    this.fs = fs || new NodeFs();
    this.path = path;
    this.nodeResolveModule = new NodeResolveModule();
    this.storage = new NodeStorage(this.fs);

    this.packageDir = path.join(__dirname, '..', '..', '..');
    this.distDir = path.join(this.packageDir, 'dist');

    this.sysUtil = require(path.join(this.distDir, 'sys', 'node', 'sys-util.js'));

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

    const availableCpus = os.cpus().length;
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
      typescriptVersion: this.typescriptPackageJson.version
    };
  }

  async autoprefixCss(input: string, opts: any): Promise<string> {
    return this.sysWorker.run('autoprefixCss', [input, opts]);
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
    let hash = crypto.createHash('md5')
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
      this.sysUtil.glob(pattern, opts, (err: any, files: string[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }

  isGlob(str: string) {
    return this.sysUtil.isGlob(str);
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
      this.nodeLazyRequire = new NodeLazyRequire(this.nodeResolveModule, this.sysUtil.semver, this.packageJsonData);
    }
    return this.nodeLazyRequire;
  }

  minifyCss(input: string, filePath?: string, opts: any = {}) {
    return this.sysWorker.run('minifyCss', [input, filePath, opts]);
  }

  minifyJs(input: string, opts?: any) {
    return this.sysWorker.run('minifyJs', [input, opts]);
  }

  minimatch(filePath: string, pattern: string, opts: any) {
    return this.sysUtil.minimatch(filePath, pattern, opts);
  }

  open(p: string) {
    return this.sysUtil.opn(p);
  }

  get details() {
    const details: d.SystemDetails = {
      cpuModel: '',
      cpus: -1,
      platform: '',
      release: '',
      runtime: 'node',
      runtimeVersion: '',
      tmpDir: os.tmpdir()
    };
    try {
      const cpus = os.cpus();
      details.cpuModel = cpus[0].model;
      details.cpus = cpus.length;
      details.platform = os.platform();
      details.release = os.release();
      details.runtimeVersion = process.version;
    } catch (e) {}
    return details;
  }

  requestLatestCompilerVersion() {
    return this.sysWorker.run('requestLatestCompilerVersion');
  }

  resolveModule(fromDir: string, moduleId: string) {
    return this.nodeResolveModule.resolveModule(fromDir, moduleId);
  }

  get rollup() {
    const rollup = require('rollup');
    rollup.plugins = {
      commonjs: require('rollup-plugin-commonjs'),
      nodeResolve: require('rollup-plugin-node-resolve')
    };
    return rollup;
  }

  scopeCss(cssText: string, scopeId: string, hostScopeId: string, slotScopeId: string) {
    return this.sysWorker.run('scopeCss', [cssText, scopeId, hostScopeId, slotScopeId]);
  }

  get color() {
    return this.sysUtil.turbocolor;
  }

  get semver() {
    return this.sysUtil.semver;
  }

  async transpileToEs5(cwd: string, input: string) {
    return this.sysWorker.run('transpileToEs5', [cwd, input]);
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
