'use strict';

const fs = require('fs');

const packageFile = require('read-pkg-up').sync().path;

function getVersion() {
  return process.argv[process.argv.length - 1];
}

function readPackage() {
  return JSON.parse(fs.readFileSync(packageFile, 'utf8'));
}

function writePackage(pkg) {
  fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2));
  fs.appendFileSync(packageFile, '\n');
}

let pkg = readPackage();
pkg.version = getVersion();
writePackage(pkg);
