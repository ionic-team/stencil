const fs = require('fs');
const path = require('path');
const transpiler = require('../../ionic-core/dist/commonjs/transpiler');


transpiler.transpileProject({
  srcDir: path.join(__dirname, '../src/'),
  writeTranspiledFilesToDisk: true
});
