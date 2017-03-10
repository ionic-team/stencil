var path = require('path');
var compiler = require('../dist/compiler');


var srcDir = path.join(__dirname, '../src/components/');
var jsDir = path.join(__dirname, '../dist/transpiled-core/components/');
var cssDir = path.join(__dirname, '../dist/ionic-web/dist/');


compiler.compileComponents(srcDir, jsDir, cssDir);

