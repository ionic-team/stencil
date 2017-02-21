const fs = require('fs');
const path = require('path');
const transpiler = require('../../../ionic-core/dist/es2015/transpiler/index');


transpiler.transpileProject({
  srcDir: path.join(__dirname, '../src/'),
  writeTranspiledFilesToDisk: true
});
