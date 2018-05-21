import * as d from '../../declarations';
import { createContext, runInContext } from './node-context';
import { createDom } from './node-dom';
import { NodeFs } from './node-fs';
import { normalizePath } from '../../compiler/util';

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as url from 'url';


export class NodeSystem implements d.StencilSystem {
  private packageJsonData: d.PackageJsonData;
  private distDir: string;
  private runtime: string;
  private sysUtil: any;
  private typescriptPackageJson: d.PackageJsonData;
  private resolveModuleCache: { [cacheKey: string]: string } = {};

  fs: d.FileSystem;
  path: d.Path;


  constructor(fs?: d.FileSystem) {
    this.fs = fs || new NodeFs();
    this.path = path;

    const rootDir = path.join(__dirname, '..', '..', '..');
    this.distDir = path.join(rootDir, 'dist');

    this.sysUtil = require(path.join(this.distDir, 'sys', 'node', 'sys-util.js'));
    this.runtime = path.join(this.distDir, 'compiler', 'index.js');

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

  get compiler() {
    return {
      name: this.packageJsonData.name,
      version: this.packageJsonData.version,
      runtime: this.runtime,
      typescriptVersion: this.typescriptPackageJson.version
    };
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

  createWatcher(events: d.BuildEvents, paths: string, opts: any) {
    const chokidar = require('chokidar');
    const watcher = chokidar.watch(paths, opts);

    watcher
      .on('change', (path: string) => {
        events.emit('fileUpdate', path);
      })
      .on('add', (path: string) => {
        events.emit('fileAdd', path);
      })
      .on('unlink', (path: string) => {
        events.emit('fileDelete', path);
      })
      .on('addDir', (path: string) => {
        events.emit('dirAdd', path);
      })
      .on('unlinkDir', (path: string) => {
        events.emit('dirDelete', path);
      })
      .on('error', (err: any) => {
        console.error(err);
      });

    return watcher;
  }

  generateContentHash(content: string, length: number): string {
    return crypto.createHash('sha1')
                     .update(content)
                     .digest('base64')
                     .replace(/\W/g, '')
                     .substr(0, length)
                     .toLowerCase();
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

  loadConfigFile(configPath: string) {
    let config: d.Config;

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
      } catch (e) {
        throw new Error(`Invalid Stencil configuration file "${configPath}".`);
      }
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
        rootDir: process.cwd()
      };
    }

    if (!config.sys) {
      config.sys = this;
    }

    return config;
  }

  async autoprefixCss(input: string, opts: any): Promise<string> {
    const modulePath = path.join(this.distDir, 'sys', 'node', 'auto-prefixer.js');
    const module = require(modulePath);

    const postcss = module.postcss;
    const autoprefixer = module.autoprefixer;
    if (typeof opts !== 'object') {
      opts = {
        browsers: [
          'last 2 versions',
          'iOS >= 8',
          'Android >= 4.4',
          'Explorer >= 11',
          'ExplorerMobile >= 11'
        ],
        cascade: false,
        remove: false
      };
    }
    const prefixer = postcss([autoprefixer(opts)]);
    const result = await prefixer.process(input, {
      map: false,
      from: undefined
    });
    return result.css;
  }

  minifyCss(input: string) {
    const cleanCssModule = path.join(this.distDir, 'sys', 'node', 'clean-css.js');
    const CleanCSS = require(cleanCssModule).cleanCss;
    const result = new CleanCSS().minify(input);
    const diagnostics: d.Diagnostic[] = [];

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
    const diagnostics: d.Diagnostic[] = [];

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

  get platform() {
    return os.platform();
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

      const resolvedModulePath = normalizePath(packageJsonFilePath);

      this.resolveModuleCache[cacheKey] = resolvedModulePath;

      return resolvedModulePath;
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

  get semver() {
    return this.sysUtil.semver;
  }

  tmpdir() {
    return path.join(os.tmpdir(), `stencil-${this.packageJsonData.version}`);
  }

  get url() {
    return url;
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
