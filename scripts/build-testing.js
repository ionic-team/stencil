const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const transpile = require('./transpile');
const { getDefaultBuildConditionals, rollupPluginReplace } = require('../dist/transpiled-build-conditionals/build-conditionals');


const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-testing');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'testing', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'testing');
const DEST_FILE = path.join(DEST_DIR, 'index.js');


const success = transpile(path.join('..', 'src', 'testing', 'tsconfig.json'));

if (success) {

  const buildConditionals = getDefaultBuildConditionals();
  const replaceObj = Object.keys(buildConditionals).reduce((all, key) => {
    all[`__BUILD_CONDITIONALS__.${key}`] = buildConditionals[key];
    return all;
  }, {});

  fixCssWhatImport();

  function bundleTestingUtils() {
    rollup.rollup({
      input: ENTRY_FILE,
      external: [
        'fs',
        'jest-environment-node',
        'os',
        'path',
        'puppeteer',
        'rollup',
        'rollup-plugin-commonjs',
        'rollup-plugin-node-resolve',
        'rollup-plugin-node-builtins',
        'rollup-pluginutils',
        'typescript'
      ],
      plugins: [
        rollupResolve({
          jsnext: true
        }),
        rollupCommonjs(),
        rollupPluginReplace({
          values: replaceObj
        })
      ],
      onwarn: (message) => {
        if (/top level of an ES module/.test(message)) return;
        console.error( message );
      }

    }).then(bundle => {

      // copy over all the .d.ts file too
      fs.copy(path.dirname(ENTRY_FILE), DEST_DIR, {
        filter: (src) => {
          return src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1;
        }
      });

      // bundle up the testing utilities into one js file
      bundle.write({
        format: 'cjs',
        file: DEST_FILE

      }).catch(err => {
        console.log(`build testing error: ${err}`);
        process.exit(1);
      });

    }).catch(err => {
      console.log(`build testing error: ${err}`);
      process.exit(1);
    });
  }

  bundleTestingUtils();

  process.on('exit', () => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ testing: ${DEST_FILE}`);
  });

}


function fixCssWhatImport() {
  // for unit tests to work, typescript expects the syntax "import * as cssWhat from 'css-what';"
  // but for bundling, rollup expects "import cssWhat from 'css-what';"
  // basically this issue: https://github.com/Microsoft/TypeScript/issues/5565
  // except that doesn't seem to work when transpiling isolated modules, idk
  // this is an uber hack just to get both scenarios to work
  const transpiledFile = path.join(TRANSPILED_DIR, 'testing', 'mock-doc', 'selector.js');

  let transpiledContent = fs.readFileSync(transpiledFile, 'utf8');
  transpiledContent = transpiledContent.replace('import * as cssWhat ', 'import cssWhat ');

  fs.writeFileSync(transpiledFile, transpiledContent);
}
