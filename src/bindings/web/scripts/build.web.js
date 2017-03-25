var util = require('../../../../scripts/util');
var compiler = require(util.distPath('compiler'));


console.log('build ionic-web');


compiler.compile({
  srcDir: util.srcPath('components'),
  destDir: util.distPath('ionic-web'),
  ionicCoreDir: util.distPath('ionic-core/web'),
  ionicThemesDir: util.distPath('ionic-core/themes'),
});
