import { BuildConfig, Diagnostic, PackageJsonData, StencilSystem } from '../../util/interfaces';
import { createContext, runInContext } from './node-context';
import { createDom } from './node-dom';
import { normalizePath } from '../../compiler/util';


export class NodeSystem implements StencilSystem {
  coreClientFileCache: {[key: string]: string} = {};
  nodeFs: any;
  nodePath: any;
  packageJsonData: PackageJsonData;
  packageDistDir: string;
  sysUtil: any;
  typescriptPackageJson: PackageJsonData;


  constructor(fs?: any, path?: any) {
    this.nodeFs = fs || require('fs');
    this.nodePath = path || require('path');
    this.sysUtil = require(this.nodePath.join(__dirname, './sys-util.js'));
    this.init();
  }

  init() {
    const packageRootDir = this.nodePath.join(__dirname, '../../../');
    this.packageDistDir = this.nodePath.join(packageRootDir, 'dist', 'client');

    try {
      this.packageJsonData = require(this.nodePath.join(packageRootDir, 'package.json'));
    } catch (e) {
      throw new Error(`unable to resolve "package.json" from: ${packageRootDir}`);
    }

    try {
      this.typescriptPackageJson = require(this.resolveModule(packageRootDir, 'typescript')) as PackageJsonData;
    } catch (e) {
      throw new Error(`unable to resolve "typescript" from: ${packageRootDir}`);
    }
  }

  get compiler() {
    return {
      name: this.packageJsonData.name,
      version: this.packageJsonData.version,
      typescriptVersion: this.typescriptPackageJson.version
    };
  }


  copy(src: string, dest: string, opts: any) {
    return new Promise<void>((resolve, reject) => {
      opts = opts || {};
      this.sysUtil.fsExtra.copy(src, dest, opts, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  get createDom() {
    return createDom;
  }

  emptyDir(dir: any) {
    return new Promise<void>((resolve, reject) => {
      this.sysUtil.fsExtra.emptyDir(dir, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  ensureDir(dir: any) {
    return new Promise<void>((resolve, reject) => {
      this.sysUtil.fsExtra.ensureDir(dir, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  ensureDirSync(dir: any) {
    this.sysUtil.fsExtra.ensureDirSync(dir);
  }

  ensureFile(file: any) {
    return new Promise<void>((resolve, reject) => {
      this.sysUtil.fsExtra.ensureFile(file, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  get fs() {
    return this.nodeFs;
  }

  generateContentHash(content: string, length: number): string {
    const crypto = require('crypto');
    return crypto.createHash('sha1')
                  .update(content)
                  .digest('base64')
                  .replace(/\W/g, '')
                  .substr(0, length)
                  .toLowerCase();
  }

  getClientCoreFile(opts: any) {
    const filePath = this.nodePath.join(this.packageDistDir, opts.staticName);

    return new Promise<string>((resolve, reject) => {
      if (this.coreClientFileCache[filePath]) {
        resolve(this.coreClientFileCache[filePath]);

      } else {
        this.nodeFs.readFile(filePath, 'utf-8', (err: Error, data: string) => {
          if (err) {
            reject(err);
          } else {
            this.coreClientFileCache[filePath] = data;
            resolve(data);
          }
        });
      }
    });
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

  loadConfigFile(configPath: string) {
    let config: BuildConfig;

    if (!this.nodePath.isAbsolute(configPath)) {
      throw new Error(`Stencil configuration file "${configPath}" must be an absolute path.`);
    }

    try {
      const fileStat = this.nodeFs.statSync(configPath);
      if (fileStat.isDirectory()) {
        // this is only a directory, so let's just assume we're looking for in stencil.config.js
        // otherwise they could pass in an absolute path if it was somewhere else
        configPath = this.nodePath.join(configPath, 'stencil.config.js');
      }

      // the passed in config was a string, so it's probably a path to the config we need to load
      const configFileData = require(configPath);
      if (!configFileData.config) {
        throw new Error(`Invalid Stencil configuration file "${configPath}". Missing "config" property.`);
      }

      config = configFileData.config;
      config.configPath = configPath;

      if (!config.rootDir && configPath) {
        config.rootDir = this.nodePath.dirname(configPath);
      }

    } catch (e) {
      throw new Error(`Error reading Stencil configuration file "${configPath}". ` + e);
    }

    if (!config.sys) {
      config.sys = this;
    }

    return config;
  }

  minifyCss(input: string) {
    const CleanCSS = require(this.nodePath.join(__dirname, './clean-css.js')).cleanCss;
    const result = new CleanCSS().minify(input);
    const diagnostics: Diagnostic[] = [];

    if (result.errors) {
      result.errors.forEach((msg: string) => {
        diagnostics.push({
          header: 'Minify CSS',
          messageText: msg,
          level: 'error',
          type: 'build'
        });
      });
    }

    if (result.warnings) {
      result.warnings.forEach((msg: string) => {
        diagnostics.push({
          header: 'Minify CSS',
          messageText: msg,
          level: 'warn',
          type: 'build'
        });
      });
    }

    return {
      output: result.styles,
      sourceMap: result.sourceMap,
      diagnostics: diagnostics
    };
  }

  minifyJs(input: string, opts?: any) {
    const UglifyJS = require('uglify-es');
    const result = UglifyJS.minify(input, opts);
    const diagnostics: Diagnostic[] = [];

    if (result.error) {
      diagnostics.push({
        header: 'Minify JS',
        messageText: result.error.message,
        level: 'error',
        type: 'build'
      });
    }

    return {
      output: (result.code as string),
      sourceMap: result.sourceMap,
      diagnostics: diagnostics
    };
  }

  minimatch(filePath: string, pattern: string, opts: any) {
    return this.sysUtil.minimatch(filePath, pattern, opts);
  }

  get path() {
    return this.nodePath;
  }

  remove(dir: string) {
    return new Promise<void>((resolve, reject) => {
      this.sysUtil.fsExtra.remove(dir, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  resolveModule(fromDir: string, moduleId: string) {
    const Module = require('module');

    fromDir = this.nodePath.resolve(fromDir);
    const fromFile = this.nodePath.join(fromDir, 'noop.js');

    let dir = Module._resolveFilename(moduleId, {
      id: fromFile,
      filename: fromFile,
      paths: Module._nodeModulePaths(fromDir)
    });

    const root = this.nodePath.parse(fromDir).root;
    let packageJsonFilePath: any;

    while (dir !== root) {
      dir = this.nodePath.dirname(dir);
      packageJsonFilePath = this.nodePath.join(dir, 'package.json');

      try {
        this.nodeFs.accessSync(packageJsonFilePath);
      } catch (e) {
        continue;
      }

      return normalizePath(packageJsonFilePath);
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

  get sass() {
    return require('node-sass');
  }

  get semver() {
    return this.sysUtil.semver;
  }

  get typescript() {
    return require('typescript');
  }

  get url() {
    return require('url');
  }

  get vm(): any {
    return {
      createContext,
      runInContext
    };
  }

  watch(paths: string, opts: any) {
    const chokidar = require('chokidar');
    return chokidar.watch(paths, opts);
  }

  get workbox() {
    return require('workbox-build');
  }

}
