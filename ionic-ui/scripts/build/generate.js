const fs = require('fs');
const path = require('path');
const compiler = require('../../../ionic-core/dist/es2015/compiler/index');


function compileComponents() {
  let inputFilePath = path.join(__dirname, '../../dist/es2015/components/button/button.js');

  console.log(inputFilePath)

  let promises = [
    compiler.compileFile(inputFilePath)
  ];

  Promise.all(promises).then(files => {

    files.forEach(f => {
      console.log(f);
    });

  });
}

compileComponents();
