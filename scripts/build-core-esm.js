const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');


async function buildCoreEsm(inputFile, outputFile) {
  const rollupBuild = await rollup.rollup({
    input: inputFile,
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  const { output } = await rollupBuild.generate({
    format: 'esm'
  });

  let code = output[0].code.trim();
  code = dynamicImportFnHack(code);
  code = polyfillsHack(code);

  fs.writeFileSync(outputFile, code);
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
