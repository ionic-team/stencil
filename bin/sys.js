'use strict';

var coreClientFileCache = {};


module.exports = Object.defineProperties({

  copyDir: function copyDir(source, dest, callback) {
    var copyDir = require('./copy-directory');
    copyDir(source, dest, {}, callback);
  },

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

  fs: require('fs'),

  minifyCss: function minifyCss(input) {
    var CleanCSS = require('clean-css');
    var result = new CleanCSS().minify(input);
    var diagnostics = [];

    if (result.errors) {
      result.errors.forEach(function(msg) {
        diagnostics.push({
          msg: msg,
          level: 'error'
        });
      });
    }

    if (result.warnings) {
      result.warnings.forEach(function(msg) {
        diagnostics.push({
          msg: msg,
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
    var UglifyJS = require('uglify-js');
    var result = UglifyJS.minify(input);
    var diagnostics = [];

    if (result.error) {
      diagnostics.push({
        msg: result.error.message,
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

  rmDir: function rmdir(directory, options, callback) {
    var rimraf = require('./rimraf');
    rimraf(directory, options, callback);
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
  typescript: { get: function() { return require('typescript'); } }
});
