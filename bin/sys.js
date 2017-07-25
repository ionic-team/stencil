'use strict';

var coreClientFileCache = {};


module.exports = Object.defineProperties({

  copyDir: function copyDir(source, dest, callback) {
    var copyDir = require('./copy-directory');
    copyDir(source, dest, {}, callback);
  },

  createDom: function createDom() {
    var createDom = require('./create-dom');
    return createDom();
  },

  fs: require('fs'),

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
    var fs = require('fs');
    var path = require('path');
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

  minifyCss: function minifyCss(input) {
    var CleanCSS = require('clean-css');
    var result = new CleanCSS().minify(input);
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

  path: require('path'),

  resolveModule: function resolveModule(fromDir, moduleId) {
    var module = require('module');
    var path = require('path');

    fromDir = path.resolve(fromDir);
    var fromFile = path.join(fromDir, 'noop.js');

    return module._resolveFilename(moduleId, {
      id: fromFile,
      filename: fromFile,
      paths: module._nodeModulePaths(fromDir)
    });
  },

  rmDir: function rmdir(directory, callback) {
    var rimraf = require('./rimraf');
    rimraf(directory, callback);
  },

  vm: {
    createContext: function(sandbox) {
      var vm = require('vm');
      // https://github.com/tmpvar/jsdom/issues/1724
      // manually adding a fetch polyfill until jsdom adds it
      sandbox.fetch = require('node-fetch');
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

});
