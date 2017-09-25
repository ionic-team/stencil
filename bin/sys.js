'use strict';

var fs = require('fs');
var path = require('path');
var util = require('../dist/cli/util');
var coreClientFileCache = {};


module.exports = Object.defineProperties({

  copy: function(src, dest, opts) {
    return new Promise(function(resolve, reject) {
      opts = opts || {};
      util.fsExtra.copy(src, dest, opts, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  createDom: function createDom() {
    var createDom = require('./create-dom');
    return createDom();
  },

  emptyDir: function(dir) {
    return new Promise(function(resolve, reject) {
      util.fsExtra.emptyDir(dir, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  ensureDir: function(dir) {
    return new Promise(function(resolve, reject) {
      util.fsExtra.ensureDir(dir, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  fs: fs,

  generateContentHash: function generateContentHash(content, length) {
    var crypto = require('crypto');
    return crypto.createHash('sha1')
                 .update(content)
                 .digest('base64')
                 .replace(/\W/g, '')
                 .substr(0, length)
                 .toLowerCase();
  },

  getClientCoreFile: function getClientCoreFile(opts) {
    var filePath = path.join(__dirname, '..', 'dist', 'client', opts.staticName);

    return new Promise(function(resolve, reject) {
      if (coreClientFileCache[filePath]) {
        resolve(coreClientFileCache[filePath]);

      } else {
        fs.readFile(filePath, 'utf-8', function(err, data) {
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

  glob: function(pattern, opts) {
    return new Promise(function(resolve, reject) {
      util.glob(pattern, opts, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  },

  loadConfigFile: function loadConfigFile(configPath) {
    var config, configFileData;

    try {
      delete require.cache[require.resolve(configPath)];
      configFileData = require(configPath);

      if (!configFileData.config) {
        console.error('Invalid Stencil "' + configPath + '" configuration file. Missing "config" property.');
        return null;
      }

      config = configFileData.config;
      config.configPath = configPath;

    } catch(e) {
      console.error('Error reading Stencil "' + configPath + '" configuration file.');
      return null;
    }

    if (!config.rootDir) {
      config.rootDir = path.dirname(configPath);
    }

    return config;
  },

  isGlob: function(str) {
    return util.isGlob(str);
  },

  minifyCss: function minifyCss(input) {
    var cleanCSS = require('../dist/cli/clean-css');
    var result = cleanCSS.minify(input);
    var diagnostics = [];

    if (result.errors) {
      result.errors.forEach(function(msg) {
        diagnostics.push({
          messageText: msg,
          level: 'error'
        });
      });
    }

    if (result.warnings) {
      result.warnings.forEach(function(msg) {
        diagnostics.push({
          messageText: msg,
          level: 'warn'
        });
      });
    }

    return {
      output: result.styles,
      sourceMap: result.sourceMap,
      diagnostics: diagnostics
    };
  },

  minifyJs: function minifyJs(input) {
    var UglifyJS = require('uglify-es');
    var result = UglifyJS.minify(input);
    var diagnostics = [];

    if (result.error) {
      diagnostics.push({
        messageText: result.error.message,
        level: 'error'
      });
    }

    return {
      output: result.code,
      sourceMap: result.sourceMap,
      diagnostics: diagnostics
    };
  },

  path: path,

  remove: function(dir) {
    return new Promise(function(resolve, reject) {
      util.fsExtra.remove(dir, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  resolveModule: function resolveModule(fromDir, moduleId) {
    var Module = require('module');

    fromDir = path.resolve(fromDir);
    var fromFile = path.join(fromDir, 'noop.js');

    var dir = Module._resolveFilename(moduleId, {
      id: fromFile,
      filename: fromFile,
      paths: Module._nodeModulePaths(fromDir)
    });

    var root = path.parse(fromDir).root;
    var packageJson, packageJsonFilePath, packageData;

    while (dir !== root) {
      dir = path.dirname(dir);
      packageJsonFilePath = path.join(dir, 'package.json');

      try {
        packageJson = fs.readFileSync(packageJsonFilePath);
      } catch (e) {
        continue;
      }

      packageData = JSON.parse(packageJson);

      if (!packageData.collection) {
        throw new Error('stencil collection "' + moduleId + '" is missing the "collection" key from its package.json: ' + packageJsonFilePath);
      }

      return path.join(dir, packageData.collection);
    }

    throw new Error('error loading "' + moduleId + '" from "' + fromDir + '"');
  },

  vm: {
    createContext: function(ctx, wwwDir, sandbox) {
      var vm = require('vm');
      // https://github.com/tmpvar/jsdom/issues/1724
      // manually adding a fetch polyfill until jsdom adds it
      var patchFetch = require('../dist/cli/patch-fetch-xhr');
      patchFetch.patchFetchXhr(ctx, wwwDir, sandbox);

      var patchRaf = require('../dist/cli/patch-raf');
      patchRaf.patchRaf(sandbox);

      return vm.createContext(sandbox);
    },
    runInContext: function(code, contextifiedSandbox, options) {
      var vm = require('vm');
      vm.runInContext(code, contextifiedSandbox, options);
    }
  },

  watch: function watch(paths, opts) {
    var chokidar = require('chokidar');
    return chokidar.watch(paths, opts);
  }

}, {
  // sys on-demand getters
  rollup: { get: function() {
      var rollup = require('rollup');
      rollup.plugins = {
        commonjs: require('rollup-plugin-commonjs'),
        nodeResolve: require('rollup-plugin-node-resolve')
      };
      return rollup;
    }
  },

  sass: { get: function() { return require('node-sass'); } },

  typescript: { get: function() { return require('typescript'); } },

  url: { get: function() { return require('url'); } },

  workbox: { get: function() { return require('workbox-build'); } }

});
