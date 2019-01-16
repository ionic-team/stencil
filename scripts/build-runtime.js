const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const transpile = require('./transpile');
const buildPolyfills = require('./build-polyfills');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const TRANSPILED_DIR = path.join(DST_DIR, 'transpiled-runtime');
const DIST_RUNTIME_DIR = path.join(DST_DIR, 'runtime');

const inputFile = path.join(TRANSPILED_DIR, 'runtime', 'index.js');

const outputPolyfillsDir = path.join(DIST_RUNTIME_DIR, 'polyfills');
const transpiledPolyfillsDir = path.join(TRANSPILED_DIR, 'client', 'polyfills');


async function bundleRuntime() {
  const build = await rollup.rollup({
    input: inputFile,
    external: [
      '@stencil/core/build-conditionals',
      '@stencil/core/platform',
      '@stencil/core/renderer/vdom',
      '@stencil/core/utils'
    ],
    onwarn: (message) => {
      if (/top level of an ES module/.test(message)) return;
      console.error(message);
    }
  });

  await Promise.all([
    build.write({
      format: 'es',
      file: path.join(DIST_RUNTIME_DIR, 'index.mjs')
    }),
    build.write({
      format: 'cjs',
      file: path.join(DIST_RUNTIME_DIR, 'index.js')
    })
  ]);

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


function createDts() {
  const declarationSrcFiles = [
    path.join(SRC_DIR, 'declarations', 'component-interfaces.ts'),
    path.join(SRC_DIR, 'declarations', 'jsx.ts'),
    path.join(SRC_DIR, 'declarations', 'vdom.ts')
  ];

  const declarationsFileContents = declarationSrcFiles
    .map(sf => fs.readFileSync(sf, { encoding: 'utf8'} ).toString())
    .join('\n');

  const declarationsFilePath = path.join(DIST_RUNTIME_DIR, 'declarations', 'stencil.core.d.ts');
  fs.emptyDirSync(path.dirname(declarationsFilePath));
  fs.writeFileSync(declarationsFilePath, declarationsFileContents);
}


process.on('exit', () => {
  fs.removeSync(TRANSPILED_DIR);
  console.log(`✅  runtime`);
});


const success = transpile(path.join('..', 'src', 'runtime', 'tsconfig.json'));

if (success) {
  fs.emptyDirSync(DIST_RUNTIME_DIR);

  bundleRuntime();
  createDts();
  createPublicTypeExports();
  createPublicJavaScriptExports();
  buildPolyfills(transpiledPolyfillsDir, outputPolyfillsDir);

} else {
  console.log(`❌  runtime`);
}
