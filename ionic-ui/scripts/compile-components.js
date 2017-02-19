const fs = require('fs');
const path = require('path');
const compiler = require('../../ionic-core/dist/es2015/compiler/index');


function compileComponents(opts) {

  compiler.compileDirectory(opts).then(files => {

    files.forEach(f => {

      f.components.forEach(c => {
        console.log(`ionic-ui: ${c.tag} ${f.inputFilePath}`);
      });

    });

  });

}

compileComponents({
  inputDir: path.join(__dirname, '../dist/commonjs/components/'),
  sourceFileDir: path.join(__dirname, '../src/components/'),
  preserveWhitespace: false
});
