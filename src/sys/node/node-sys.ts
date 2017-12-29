import { Diagnostic, PackageJsonData, StencilSystem } from '../../util/interfaces';
import { createContext, runInContext } from './node-context';
import { createDom } from './node-dom';
import { normalizePath } from '../../compiler/util';
import * as fs from 'fs';
import * as path from 'path';


export class NodeSystem implements StencilSystem {
  packageRootDir: string;
  coreClientFileCache: {[key: string]: string} = {};
  packageJsonData: PackageJsonData;
  typescriptPackageJson: PackageJsonData;
  sysUtil: any;


  constructor() {
    this.init();
  }

  init() {
    this.packageRootDir = path.join(__dirname, '../../');

    try {
      this.packageJsonData = require(path.join(this.packageRootDir, 'package.json'));
    } catch (e) {
      throw new Error(`unable to resolve "package.json" from: ${this.packageRootDir}`);
    }

    try {
      this.typescriptPackageJson = require(this.resolveModule(this.packageRootDir, 'typescript')) as PackageJsonData;
    } catch (e) {
      throw new Error(`unable to resolve "typescript" from: ${this.packageRootDir}`);
    }

    this.sysUtil = require(path.join(__dirname, './sys-util.js'));
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
    return fs;
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
    const filePath = path.join(this.packageRootDir, 'client', opts.staticName);

    return new Promise<string>((resolve, reject) => {
      if (this.coreClientFileCache[filePath]) {
        resolve(this.coreClientFileCache[filePath]);

      } else {
        fs.readFile(filePath, 'utf-8', (err: Error, data: string) => {
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

  minifyCss(input: string) {
    const CleanCSS = require(path.join(__dirname, './clean-css.js')).cleanCss;
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
    return path;
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
