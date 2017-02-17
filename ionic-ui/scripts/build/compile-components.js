const fs = require('fs');
const path = require('path');
const compiler = require('../../../ionic-core/dist/es2015/compiler/index');


function compileComponents(inputDir) {

  compiler.compileDirectory(inputDir).then((files) => {

    files.forEach(f => {

      f.components.forEach(c => {
        console.log(`${f.inputFilePath} : ${c.selector}`);
      });

    });

  });

}

const inputDir = path.join(__dirname, '../../dist/commonjs/components/');

compileComponents(inputDir);
