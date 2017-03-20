var common = require('../../../../scripts/util');
var path = require('path');
var fs = require('fs-extra');
var rollup = require('rollup');
var compiler = require(common.distPath('compiler'));


var task = 'build ionic-angular';
console.log(task);


var srcDir = common.srcPath('components');
var jsDir = common.distPath('transpiled-web/components');
var cssDir = common.distPath('ionic-web/dist');
var entryFile = common.distPath('transpiled-angular/bindings/angular/src/components/index.js');
var outputFile = common.distPath('ionic-angular/dist/ionic.components.js');


compiler.compileComponents(srcDir, jsDir, cssDir).then(() => {

  fs.ensureDirSync(path.dirname(outputFile));

  rollup.rollup({
    entry: entryFile

  }).then(function(bundle) {
    var result = bundle.generate({
      format: 'umd'
    });

    var content = common.lessEs6Please(result.code);

    fs.writeFileSync(outputFile, content);

    console.log(task, 'bundle:', outputFile);
  });

});
