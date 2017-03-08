var path = require('path');
var compiler = require('../dist/compiler');


var componentSrcDir = path.join(__dirname, '../src/components');
var componentDestDir = path.join(__dirname, '../dist/transpiled-core/components');


compiler.compileComponents(componentSrcDir, componentDestDir);

