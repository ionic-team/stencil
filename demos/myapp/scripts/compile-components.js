const fs = require('fs');
const path = require('path');
const compiler = require('../../../ionic-core/dist/es2015/compiler/index');


function compileComponents(opts) {

  compiler.compileDirectory(opts).then(files => {

    files.forEach(f => {

      f.components.forEach(c => {
        console.log(`demo/myapp: ${c.selector} ${f.inputFilePath}`);
      });

    });

  });

}


compileComponents({
  inputDir: path.join(__dirname, '../dist/'),
  sourceFileDir: path.join(__dirname, '../src/')
});

