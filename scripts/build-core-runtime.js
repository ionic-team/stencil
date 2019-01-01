const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const transpile = require('./transpile');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const TRANSPILED_DIR = path.join(DST_DIR, 'transpiled-runtime');
const DIST_RUNTIME_DIR = path.join(DST_DIR, 'runtime');

const inputFile = path.join(TRANSPILED_DIR, 'core-runtime', 'index.js');
const outputFile = path.join(DIST_RUNTIME_DIR, 'index.js');


async function bundleRuntimeCore() {
  const build = await rollup.rollup({
    input: inputFile,
    onwarn: (message) => {
      if (/top level of an ES module/.test(message)) return;
      console.error(message);
    }
  });

  const results = await build.generate({
    format: 'es',
  });

  fs.writeFileSync(outputFile, results.code);
}


function createPublicJavaScriptExports() {
  const entryPath = path.join(DST_DIR, 'index.js');
  fs.writeFileSync(entryPath,
    `export function h() {}`
  );
}


function createPublicTypeExports() {
  const declarationsContent = [];
  const declarationsDir = path.join(TRANSPILED_DIR, 'declarations');

  const declarationFileNames = fs.readdirSync(declarationsDir).filter(f => f !== 'index.d.ts');

  declarationFileNames.forEach(declarationsFile => {
    const declarationsPath = path.join(declarationsDir, declarationsFile);
    if (declarationsPath.endsWith('.d.ts')) {

      let fileContent = fs.readFileSync(declarationsPath, 'utf8');
      fileContent = fileContent.replace(/import \* as d (.*);/g, '');
      fileContent = fileContent.replace(/\: d\./g, ': ');
      fileContent = fileContent.replace(/<d\./g, '<');
      fileContent = fileContent.replace(/\, d\./g, ', ');
      fileContent = fileContent.replace(/=> d\./g, '=> ');
      fileContent = fileContent.replace(/\| d\./g, '| ');
      fileContent = fileContent.replace(/extends d\./g, 'extends ');
      fileContent = fileContent.trim();

      declarationsContent.push(fileContent);
    }
  });

  let fileContent = declarationsContent.join('\n');

  const outputDeclarationsFile = path.join(DST_DIR, 'declarations', 'index.d.ts');
  fs.emptyDirSync(path.dirname(outputDeclarationsFile));
  fs.writeFileSync(outputDeclarationsFile, fileContent);

  const transpiledDeclarationsIndexPath = path.join(TRANSPILED_DIR, 'index.d.ts');
  const distDeclarationsIndexPath = path.join(DST_DIR, 'index.d.ts');
  fs.copyFileSync(transpiledDeclarationsIndexPath, distDeclarationsIndexPath);
}


function createRuntimeDts() {
  const declarationSrcFiles = [
    path.join(SRC_DIR, 'declarations', 'component-interfaces.ts'),
    path.join(SRC_DIR, 'declarations', 'jsx.ts'),
    path.join(SRC_DIR, 'declarations', 'vdom.ts')
  ];

  const declarationsFileContents = declarationSrcFiles
    .map(sf => fs.readFileSync(sf, { encoding: 'utf8'} ).toString())
    .join('\n');

  const declarationsFilePath = path.join(DST_DIR, 'runtime', 'declarations', 'stencil.core.d.ts');
  fs.emptyDirSync(path.dirname(declarationsFilePath));
  fs.writeFileSync(declarationsFilePath, declarationsFileContents);
}


process.on('exit', () => {
  fs.removeSync(TRANSPILED_DIR);
  console.log(`✅ runtime: ${outputFile}`);
});


const success = transpile(path.join('..', 'src', 'core-runtime', 'tsconfig.json'));

if (success) {
  fs.emptyDirSync(DIST_RUNTIME_DIR);

  bundleRuntimeCore();
  createRuntimeDts();
  createPublicTypeExports();
  createPublicJavaScriptExports();
}
