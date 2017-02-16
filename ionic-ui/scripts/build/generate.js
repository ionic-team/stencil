
const compile  = require('../../../ionic-core/dist/es2015/compiler/index');


var out = compile.compile('<div>hi</div>', {});

console.log(out)
