import { BuildConfig, Diagnostic, Logger, StencilSystem } from '../interfaces';
import { createContext, runInContext } from './node-context';
import { createDom } from './node-dom';
import * as fs from 'fs';
import * as path from 'path';


export function getNodeSys(distRootDir: string, logger: Logger) {
  const coreClientFileCache: {[key: string]: string} = {};

  const packageJsonData = require(path.join(distRootDir, 'package.json')) as { name: string; version: string };

  const sys: StencilSystem = {

    compiler: {
      name: packageJsonData.name,
      version: packageJsonData.version
    },

    copy(src, dest, opts) {
      return new Promise((resolve, reject) => {
        opts = opts || {};
        const fsExtra = require('fs-extra');
        fsExtra.copy(src, dest, opts, (err: any) => {
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
        const fsExtra = require('fs-extra');
        fsExtra.emptyDir(dir, (err: any) => {
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
        const fsExtra = require('fs-extra');
        fsExtra.ensureDir(dir, (err: any) => {
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
        const glob = require('glob');
        glob(pattern, opts, (err: any, files: string[]) => {
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
      const isGlob = require('is-glob');
      return isGlob(str);
    },

    minifyCss(input) {
      const CleanCSS = require('clean-css');
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
        const fsExtra = require('fs-extra');
        fsExtra.remove(dir, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },

    resolveModule(fromDir, moduleId) {
      const Module = require('module');

      fromDir = path.resolve(fromDir);
      const fromFile = path.join(fromDir, 'noop.js');

      let dir = Module._resolveFilename(moduleId, {
        id: fromFile,
        filename: fromFile,
        paths: Module._nodeModulePaths(fromDir)
      });

      const root = path.parse(fromDir).root;
      let packageJson: string;
      let packageJsonFilePath: any;
      let packageData: any;

      while (dir !== root) {
        dir = path.dirname(dir);
        packageJsonFilePath = path.join(dir, 'package.json');

        try {
          packageJson = fs.readFileSync(packageJsonFilePath, 'utf-8');
        } catch (e) {
          continue;
        }

        packageData = JSON.parse(packageJson);

        if (!packageData.collection) {
          throw new Error(`stencil collection "${moduleId}" is missing the "collection" key from its package.json: ${packageJsonFilePath}`);
        }

        return path.join(dir, packageData.collection);
      }

      throw new Error(`error loading "${moduleId}" from "${fromDir}"`);
    },

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
