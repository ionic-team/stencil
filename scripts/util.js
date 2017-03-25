var path = require('path');
var fs = require('fs-extra');


function rootPath(filePath) {
  return path.join(__dirname, '../', filePath);
}

function distPath(filePath) {
  return path.join(rootPath('dist'), filePath);
}

function srcPath(filePath) {
  return path.join(rootPath('src'), filePath);
}

function nodeModulesPath(filePath) {
  return path.join(rootPath('node_modules'), filePath);
}

function compileSass(inputFile, outputFile, sassOpts) {
  return new Promise(resolve => {
    var sass = require('node-sass');

    sassOpts = sassOpts || {};

    sassOpts.file = inputFile;

    sass.render(sassOpts, (err, result) => {
      if (err) {
        console.log(err);
        resolve();

      } else {
        var fs = require('fs');

        fs.writeFile(outputFile, result.css.toString(), err => {
          if (err) {
            console.log(err);
          }
          resolve();
        });
      }
    });

  });
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });

  });
}

function writeFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function copyFile(src, dest) {
  return new Promise((resolve, reject) => {
    fs.copy(src, dest, err => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function emptyDir(src) {
  return new Promise((resolve, reject) => {
    fs.emptyDir(src, err => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}



exports.rootPath = rootPath;
exports.distPath = distPath;
exports.srcPath = srcPath;
exports.nodeModulesPath = nodeModulesPath;
exports.compileSass = compileSass;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.copyFile = copyFile;
exports.emptyDir = emptyDir;
