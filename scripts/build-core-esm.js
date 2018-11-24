const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');


async function buildCoreEsm(inputFile, outputFile) {
  const build = await rollup.rollup({
    input: inputFile,
    onwarn: (message) => {
      if (/top level of an ES module/.test(message)) return;
      console.error( message );
    }
  });

  const clientCore = await build.generate({
    format: 'es'
  });

  let code = clientCore.code.trim();
  code = dynamicImportFnHack(code);
  code = polyfillsHack(code);

  fs.writeFile(outputFile, code, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
}


function dynamicImportFnHack(input) {
  // typescript is all tripped all by import()
  // nothing a good ol' string replace can't fix ;)
  return input.replace(/__import\(/g, 'import(');
}


function polyfillsHack(input) {
  const promiseFile = path.join(__dirname, '..', 'src', 'client', 'polyfills', 'index.js');
  const promiseContent = fs.readFileSync(promiseFile, 'utf8');

  return promiseContent + '\n' + input;
}

module.exports = buildCoreEsm;
