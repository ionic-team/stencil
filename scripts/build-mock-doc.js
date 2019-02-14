const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const { run, transpile } = require('./script-utils');
const { urlPlugin } = require('./plugin-url');

const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-mock-doc');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'mock-doc', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'mock-doc');
const DEST_FILE = path.join(DEST_DIR, 'index.js');


async function bundle() {
  const rollupBuild = await rollup.rollup({
    input: ENTRY_FILE,
    plugins: [
      urlPlugin(),
      rollupResolve(),
      rollupCommonjs()
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  // bundle up the compiler into one js file
  await rollupBuild.write({
    format: 'cjs',
    file: DEST_FILE
  });

  await mergeDts(path.dirname(ENTRY_FILE), DEST_DIR);
}


async function mergeDts(srcDir, destDir) {
  const declarationsContent = [];

  const declarationFileNames = (await fs.readdir(srcDir)).filter(f => f !== 'index.d.ts');

  declarationFileNames.forEach(declarationsFile => {
    const declarationsPath = path.join(srcDir, declarationsFile);
    if (declarationsPath.endsWith('.d.ts')) {

      let fileContent = fs.readFileSync(declarationsPath, 'utf8');
      fileContent = fileContent.replace(/import (.*);/g, '');
      fileContent = fileContent.replace(/\: d\./g, ': ');
      fileContent = fileContent.replace(/<d\./g, '<');
      fileContent = fileContent.replace(/\, d\./g, ', ');
      fileContent = fileContent.replace(/=> d\./g, '=> ');
      fileContent = fileContent.replace(/\| d\./g, '| ');
      fileContent = fileContent.replace(/= d\./g, '= ');
      fileContent = fileContent.replace(/extends d\./g, 'extends ');
      fileContent = fileContent.trim();

      declarationsContent.push(fileContent);
    }
  });

  let fileContent = declarationsContent.join('\n');

  const outputDeclarationsFile = path.join(destDir, 'index.d.ts');
  await fs.writeFile(outputDeclarationsFile, fileContent);
}


run(async () => {
  transpile(path.join('..', 'src', 'mock-doc', 'tsconfig.json'));

  await bundle();

  await fs.remove(TRANSPILED_DIR);
});
