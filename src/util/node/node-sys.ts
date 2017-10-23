import { BuildConfig, Diagnostic, Logger, PackageJsonData, StencilSystem } from '../interfaces';
import { createContext, runInContext } from './node-context';
import { createDom } from './node-dom';
import { normalizePath } from '../../compiler/util';
import * as fs from 'fs';
import * as path from 'path';


export function getNodeSys(distRootDir: string, logger: Logger) {
  const coreClientFileCache: {[key: string]: string} = {};

  let packageJsonData: PackageJsonData;
  try {
    packageJsonData = require(path.join(distRootDir, 'package.json'));
  } catch (e) {
    throw new Error(`unable to resolve "package.json" from: ${distRootDir}`);
  }

  let typescriptPackageJson: PackageJsonData;
  try {
    typescriptPackageJson = require(resolveModule(distRootDir, 'typescript')) as PackageJsonData;
  } catch (e) {
    throw new Error(`unable to resolve "typescript" from: ${distRootDir}`);
  }

  const sysUtil = require('./sys-util');

  const sys: StencilSystem = {

    compiler: {
      name: packageJsonData.name,
      version: packageJsonData.version,
      typescriptVersion: typescriptPackageJson.version
    },

    copy(src, dest, opts) {
      return new Promise((resolve, reject) => {
        opts = opts || {};
        sysUtil.fsExtra.copy(src, dest, opts, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },

    createDom,

    emptyDir(dir: any) {
      return new Promise((resolve, reject) => {
        sysUtil.fsExtra.emptyDir(dir, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },

    ensureDir(dir: any) {
      return new Promise((resolve, reject) => {
        sysUtil.fsExtra.ensureDir(dir, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },

    ensureDirSync(dir: any) {
      sysUtil.fsExtra.ensureDirSync(dir);
    },

    ensureFile(file: any) {
      return new Promise((resolve, reject) => {
        sysUtil.fsExtra.ensureFile(file, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },

    fs: fs,

    generateContentHash(content, length) {
      const crypto = require('crypto');
      return crypto.createHash('sha1')
                    .update(content)
                    .digest('base64')
                    .replace(/\W/g, '')
                    .substr(0, length)
                    .toLowerCase();
    },

    getClientCoreFile(opts) {
      const filePath = path.join(distRootDir, 'client', opts.staticName);

      return new Promise((resolve, reject) => {
        if (coreClientFileCache[filePath]) {
          resolve(coreClientFileCache[filePath]);

        } else {
          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              coreClientFileCache[filePath] = data;
              resolve(data);
            }
          });
        }
      });
    },

    glob(pattern, opts) {
      return new Promise((resolve, reject) => {
        sysUtil.glob(pattern, opts, (err: any, files: string[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(files);
          }
        });
      });
    },

    loadConfigFile(configPath) {
      let config: BuildConfig;
      let configFileData: any;

      try {
        delete require.cache[require.resolve(configPath)];
        configFileData = require(configPath);

        if (!configFileData.config) {
          logger.error(`Invalid Stencil "${configPath}" configuration file. Missing "config" property.`);
          return null;
        }

        config = configFileData.config;
        config.configPath = configPath;

      } catch (e) {
        logger.error(`Error reading Stencil "${configPath}" configuration file.`);
        return null;
      }

      if (!config.rootDir) {
        config.rootDir = path.dirname(configPath);
      }

      return config;
    },

    isGlob(str: string) {
      return sysUtil.isGlob(str);
    },

    minifyCss(input) {
      const CleanCSS = require('./clean-css');
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
    },

    minifyJs(input) {
      const UglifyJS = require('uglify-es');
      const result = UglifyJS.minify(input);
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
    },

    path,

    remove(dir) {
      return new Promise((resolve, reject) => {
        sysUtil.fsExtra.remove(dir, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },

    resolveModule,

    semver: sysUtil.semver,

    vm: {
      createContext,
      runInContext
    },

    watch(paths, opts) {
      const chokidar = require('chokidar');
      return chokidar.watch(paths, opts);
    }

  };


  Object.defineProperties(sys, {
    // sys on-demand getters

    rollup: { get: () => {
        const rollup = require('rollup');
        rollup.plugins = {
          commonjs: require('rollup-plugin-commonjs'),
          nodeResolve: require('rollup-plugin-node-resolve')
        };
        return rollup;
      }
    },

    sass: { get: () => require('node-sass') },

    typescript: { get: () => require('typescript') },

    url: { get: () => require('url') },

    workbox: { get: () => require('workbox-build') }

  });

  return sys;
}


function resolveModule(fromDir: string, moduleId: string) {
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
