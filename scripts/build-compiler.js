const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const { run, transpile, updateBuildIds } = require('./script-utils');
const { urlPlugin } = require('./plugin-url');


const DIST_DIR = path.join(__dirname, '..', 'dist');
const TRANSPILED_DIR = path.join(DIST_DIR, 'transpiled-compiler');
const INPUT_FILE = path.join(TRANSPILED_DIR, 'compiler', 'index.js');
const COMPILER_DIST_DIR = path.join(DIST_DIR, 'compiler');
const COMPILER_DIST_FILE = path.join(COMPILER_DIST_DIR, 'index.js');
const UTILS_DIST_DIR = path.join(DIST_DIR, 'utils');
const DECLARATIONS_SRC_DIR = path.join(TRANSPILED_DIR, 'declarations');
const DECLARATIONS_DST_DIR = path.join(DIST_DIR, 'declarations');


async function bundleCompiler() {
  const rollupBuild = await rollup.rollup({
    input: INPUT_FILE,
    external: [
      'path',
      'typescript',
      '../mock-doc',
      '../server',
      '../sys/node',
      '../utils'
    ],
    plugins: [
      (() => {
        return {
          resolveId(id) {
            if (id === '@build-conditionals') {
              return path.join(TRANSPILED_DIR, 'compiler', 'app-core', 'build-conditionals.js');
            }
            if (id === '@mock-doc') {
              return '../mock-doc';
            }
            if (id === '@server') {
              return '../server';
            }
            if (id === '@sys') {
              return '../sys/node';
            }
            if (id === '@utils') {
              return '../utils';
            }
          }
        }
      })(),
      urlPlugin(),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs()
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  // copy over all the .d.ts file too
  await fs.copy(path.dirname(INPUT_FILE), COMPILER_DIST_DIR, {
    filter: src => {
      return src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1;
    }
  });

  await fs.copy(DECLARATIONS_SRC_DIR, DECLARATIONS_DST_DIR, {
    filter: src => {
      return src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1;
    }
  });

  const { output } = await rollupBuild.generate({
    format: 'cjs',
    file: COMPILER_DIST_FILE
  });

  const outputText = updateBuildIds(output[0].code);

  await fs.ensureDir(path.dirname(COMPILER_DIST_FILE));
  await fs.writeFile(COMPILER_DIST_FILE, outputText);
}


async function buildUtils() {
  const build = await rollup.rollup({
    input: path.join(TRANSPILED_DIR, 'utils', 'index.js'),
    plugins: [
      (() => {
        return {
          resolveId(id) {
            if (id === '@sys') {
              return '../sys/node';
            }
          }
        }
      })(),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs()
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  await Promise.all([
    build.write({
      format: 'esm',
      file: path.join(UTILS_DIST_DIR, 'index.mjs')
    }),
    build.write({
      format: 'cjs',
      file: path.join(UTILS_DIST_DIR, 'index.js')
    })
  ]);
}


run(async () => {
  transpile(path.join('..', 'src', 'compiler', 'tsconfig.json'))

  await Promise.all([
    buildUtils(),
    bundleCompiler()
  ]);

  await fs.remove(TRANSPILED_DIR);
});
