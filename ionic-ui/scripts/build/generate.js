const path = require('path');
const compiler = require('../../../ionic-core/dist/es2015/compiler/index');


compiler.compileFile(path.join(__dirname, '../../'))


var out = compile.compile('<div>hi</div>', {});

console.log(out)
