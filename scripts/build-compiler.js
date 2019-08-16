const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const { run, transpile, updateBuildIds } = require('./script-utils');
const { urlPlugin } = require('./plugin-url');
const buildPolyfills = require('./build-polyfills');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TRANSPILED_DIR = path.join(DIST_DIR, 'transpiled-compiler');
const COMPILER_INPUT_FILE = path.join(TRANSPILED_DIR, 'compiler', 'index.js');

const INTERNAL_CLIENT_INPUT = path.join(TRANSPILED_DIR, 'client', 'index.js');
const INTERNAL_CLIENT_CONDITIONALS_INPUT = path.join(TRANSPILED_DIR, 'compiler', 'browser', 'build-conditionals-client.js');
const INTERNAL_CLIENT_DIST_DIR = path.join(ROOT_DIR, 'internal', 'client');

const BROWSER_COMPILER_INPUT_FILE = path.join(TRANSPILED_DIR, 'compiler', 'browser', 'index.js');
const BROWSER_COMPILER_DIST_FILE = path.join(ROOT_DIR, 'compiler', 'stencil.js');

const COMPILER_DIST_DIR = path.join(DIST_DIR, 'compiler');
const COMPILER_DIST_FILE = path.join(COMPILER_DIST_DIR, 'index.js');
const UTILS_DIST_DIR = path.join(DIST_DIR, 'utils');
const DECLARATIONS_SRC_DIR = path.join(TRANSPILED_DIR, 'declarations');
const DECLARATIONS_DST_DIR = path.join(DIST_DIR, 'declarations');


async function bundleCompiler() {
  const rollupBuild = await rollup.rollup({
    input: COMPILER_INPUT_FILE,
    external: [
      'readline',
      'typescript'
    ],
    plugins: [
      {
        resolveId(importee) {
          if (importee === '@build-conditionals') {
            return path.join(TRANSPILED_DIR, 'compiler', 'app-core', 'build-conditionals.js');
          }
          if (importee === '@utils') {
            return path.join(TRANSPILED_DIR, 'utils', 'index.js');
          }
          if (importee === 'path') {
            return path.join(__dirname, 'helpers', 'path.js');
          }
        }
      },
      urlPlugin(),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs({
        ignore: ['path'],
        ignoreGlobal: true
      })
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  // copy over all the .d.ts file too
  await fs.copy(path.dirname(COMPILER_INPUT_FILE), COMPILER_DIST_DIR, {
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


async function bundleInternalClient() {
  const transpiledPolyfillsDir = path.join(TRANSPILED_DIR, 'client', 'polyfills');
  const outputPolyfillsDir = path.join(INTERNAL_CLIENT_DIST_DIR, 'polyfills');
  await buildPolyfills(transpiledPolyfillsDir, outputPolyfillsDir);

  const rollupBuild = await rollup.rollup({
    input: {
      'index': INTERNAL_CLIENT_INPUT,
      'build-conditionals': INTERNAL_CLIENT_CONDITIONALS_INPUT
    },

    plugins: [
      {
        resolveId(importee) {
          if (importee === '@build-conditionals') {
            return {
              id: '@stencil/core/internal/client/build-conditionals',
              external: true
            }
          }
          if (importee === '@platform') {
            return path.join(TRANSPILED_DIR, 'client', 'index.js');
          }
          if (importee === '@runtime') {
            return path.join(TRANSPILED_DIR, 'runtime', 'index.js');
          }
          if (importee === '@utils') {
            return path.join(TRANSPILED_DIR, 'utils', 'index.js');
          }
        }
      }
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  const { output } = await rollupBuild.generate({
    format: 'esm',
    dir: INTERNAL_CLIENT_DIST_DIR,
    entryFileNames: '[name].mjs',
    chunkFileNames: '[name].stencil-client.mjs'
  });

  await fs.ensureDir(INTERNAL_CLIENT_DIST_DIR);

  output.forEach(o => {
    const outputFilePath = path.join(INTERNAL_CLIENT_DIST_DIR, o.fileName);
    const outputText = updateBuildIds(o.code);
    fs.writeFileSync(outputFilePath, outputText);
  });
}


async function bundleBrowserCompiler() {
  const rollupBuild = await rollup.rollup({
    input: BROWSER_COMPILER_INPUT_FILE,

    plugins: [
      {
        resolveId(importee) {
          if (importee === '@build-conditionals') {
            return path.join(TRANSPILED_DIR, 'compiler', 'app-core', 'build-conditionals.js');
          }
          if (importee === '@utils') {
            return path.join(TRANSPILED_DIR, 'utils', 'index.js');
          }
          if (importee === 'path') {
            return require.resolve('path-browserify');
          }
          if (importee === 'typescript') {
            return path.join(TRANSPILED_DIR, 'sys', 'browser', 'browser-typescript.js');
          }
        }
      },
      urlPlugin(),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs({
        ignore: ['path'],
        ignoreGlobal: true
      })
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  const { output } = await rollupBuild.generate({
    format: 'iife',
    file: BROWSER_COMPILER_DIST_FILE,
    output: {
      name: 'stencil'
    },
    intro: fs.readFileSync(path.resolve(__dirname, 'helpers', 'browser-intro.js'), 'utf8')
  });

  const outputText = updateBuildIds(output[0].code);

  await fs.ensureDir(path.dirname(BROWSER_COMPILER_DIST_FILE));
  await fs.writeFile(BROWSER_COMPILER_DIST_FILE, outputText);
}


async function buildUtils() {
  const build = await rollup.rollup({
    input: path.join(TRANSPILED_DIR, 'utils', 'index.js'),
    plugins: [
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
    bundleCompiler(),
    bundleBrowserCompiler(),
    bundleInternalClient()
  ]);

  // await fs.remove(TRANSPILED_DIR);
});
