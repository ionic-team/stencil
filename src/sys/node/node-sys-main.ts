import * as d from '../../declarations';
import { createContext, runInContext } from './node-context';
import { createFsWatcher } from './node-fs-watcher';
import { createDom } from './node-dom';
import { NodeFs } from './node-fs';
import { normalizePath } from '../../compiler/util';
import { WorkerManager } from './worker/index';


import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as url from 'url';


export class NodeSystem implements d.StencilSystem {
  private packageJsonData: d.PackageJsonData;
  private distDir: string;
  private sysUtil: any;
  private sysWorker: WorkerManager;
  private typescriptPackageJson: d.PackageJsonData;
  private resolveModuleCache: { [cacheKey: string]: string } = {};
  private destroys: Function[] = [];

  fs: d.FileSystem;
  path: d.Path;

  constructor(fs?: d.FileSystem) {
    this.fs = fs || new NodeFs();
    this.path = path;

    const rootDir = path.join(__dirname, '..', '..', '..');
    this.distDir = path.join(rootDir, 'dist');

    this.sysUtil = require(path.join(this.distDir, 'sys', 'node', 'sys-util.js'));

    try {
      this.packageJsonData = require(path.join(rootDir, 'package.json'));
    } catch (e) {
      throw new Error(`unable to resolve "package.json" from: ${rootDir}`);
    }

    try {
      this.typescriptPackageJson = require(this.resolveModule(rootDir, 'typescript')) as d.PackageJsonData;
    } catch (e) {
      throw new Error(`unable to resolve "typescript" from: ${rootDir}`);
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

  createFsWatcher(fs: d.FileSystem, events: d.BuildEvents, fsPath: string, opts: any) {
    const fsWatcher = createFsWatcher(fs, events, fsPath, opts);

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

  gzipSize(text: string) {
    return this.sysWorker.run('gzipSize', [text]);
  }

  isGlob(str: string) {
    return this.sysUtil.isGlob(str);
  }

  loadConfigFile(configPath: string, process?: NodeJS.Process) {
    let config: d.Config;

    let cwd = '';
    if (process) {
      if (process.cwd) {
        cwd = process.cwd();
      }
      if (process.env && typeof process.env.PWD === 'string') {
        cwd = process.env.PWD;
      }
    }

    let hasConfigFile = false;

    if (typeof configPath === 'string') {
      if (!path.isAbsolute(configPath)) {
        throw new Error(`Stencil configuration file "${configPath}" must be an absolute path.`);
      }

      try {
        let fileStat = this.fs.statSync(configPath);
        if (fileStat.isFile()) {
          hasConfigFile = true;

        } else if (fileStat.isDirectory()) {
          // this is only a directory, so let's just assume we're looking for in stencil.config.js
          // otherwise they could pass in an absolute path if it was somewhere else
          configPath = path.join(configPath, 'stencil.config.js');
          fileStat = this.fs.statSync(configPath);
          hasConfigFile = fileStat.isFile();
        }
      } catch (e) {}
    }

    if (hasConfigFile) {
      // the passed in config was a string, so it's probably a path to the config we need to load
      // first clear the require cache so we don't get the same file
      delete require.cache[path.resolve(configPath)];

      const configFileData = require(configPath);
      if (!configFileData.config) {
        throw new Error(`Invalid Stencil configuration file "${configPath}". Missing "config" property.`);
      }
      config = configFileData.config;
      config.configPath = configPath;

      if (!config.rootDir && configPath) {
        config.rootDir = path.dirname(configPath);
      }

    } else {
      // no stencil.config.js file, which is fine
      config = {
        rootDir: cwd
      };
    }

    if (!config.sys) {
      config.sys = this;
    }

    config.cwd = cwd;

    return config;
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
      runtimeVersion: ''
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

  resolveModule(fromDir: string, moduleId: string) {
    const cacheKey = `${fromDir}:${moduleId}`;
    if (this.resolveModuleCache[cacheKey]) {
      return this.resolveModuleCache[cacheKey];
    }

    const Module = require('module');

    fromDir = path.resolve(fromDir);
    const fromFile = path.join(fromDir, 'noop.js');

    let dir = Module._resolveFilename(moduleId, {
      id: fromFile,
      filename: fromFile,
      paths: Module._nodeModulePaths(fromDir)
    });

    const root = path.parse(fromDir).root;
    let packageJsonFilePath: any;

    while (dir !== root) {
      dir = path.dirname(dir);
      packageJsonFilePath = path.join(dir, 'package.json');

      try {
        fs.accessSync(packageJsonFilePath);
      } catch (e) {
        continue;
      }

      this.resolveModuleCache[cacheKey] = packageJsonFilePath;

      return packageJsonFilePath;
    }

    throw new Error(`error loading "${moduleId}" from "${fromDir}"`);
  }

  get rollup() {
    const rollup = require('rollup');
    rollup.plugins = {
      commonjs: require('rollup-plugin-commonjs'),
      nodeResolve: require('rollup-plugin-node-resolve')
    };
    return rollup;
  }

  scopeCss(cssText: string, scopeAttribute: string, hostScopeAttr: string, slotScopeAttr: string) {
    return this.sysWorker.run('scopeCss', [cssText, scopeAttribute, hostScopeAttr, slotScopeAttr]);
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

  get workbox() {
    return require('workbox-build');
  }

}
