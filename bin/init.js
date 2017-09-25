var fs = require('fs');
var path = require('path');


module.exports = function init() {
  var configPath = path.join(process.cwd(), 'stencil.config.js');
  fs.writeFileSync(configPath, DEFAULT_CONFIG);
  console.log('Created ' + configPath);
};


var DEFAULT_CONFIG = "\n" +
"exports.config = {\n" +
"  namespace: 'App',\n" +
"  bundles: [],\n" +
"  collections: []\n" +
"};\n" +
"\n" +
"exports.devServer = {\n" +
"  root: 'www',\n" +
"  watchGlob: '**/**'\n" +
"};\n"
