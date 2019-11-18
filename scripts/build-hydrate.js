const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const { run, transpile, updateBuildIds } = require('./script-utils');
const { urlPlugin } = require('./plugin-url');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const TRANSPILED_DIR = path.join(DIST_DIR, 'transpiled-hydrate');
const RUNNER_INDEX_FILE = path.join(TRANSPILED_DIR, 'hydrate', 'runner', 'index.js');
const PLATFORM_INDEX_FILE = path.join(TRANSPILED_DIR, 'hydrate', 'platform', 'index.js');
const HYDRATE_DIST_DIR = path.join(DIST_DIR, 'hydrate');


async function bundleHydrateRunner() {
  const rollupBuild = await rollup.rollup({
    input: RUNNER_INDEX_FILE,
    plugins: [
      {
        resolveId(importee) {
          if (importee === '@mock-doc') {
            return {
              id: '@stencil/core/mock-doc',
              external: true,
            }
          }
          if (importee === '@hydrate-factory') {
            return {
              id: '@stencil/core/hydrate-factory',
              external: true,
            }
          }
        }
      },
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

  const { output } = await rollupBuild.generate({
    format: 'esm',
    file: 'index.mjs'
  });

  const filePath = path.join(HYDRATE_DIST_DIR, output[0].fileName);
  const outputText = updateBuildIds(output[0].code);
  await fs.writeFile(filePath, outputText);
}


async function generateHydrateDts() {
  const hydrateDtsSrc = path.join(TRANSPILED_DIR, 'declarations', 'hydrate.d.ts');
  const hydrateDtsContent = fs.readFileSync(hydrateDtsSrc, 'utf8').trim();

  const output = [
    hydrateDtsContent,
    `export declare function renderToString(html: string, opts?: RenderToStringOptions): Promise<HydrateResults>;`,
    `export declare function hydrateDocument(doc: any, opts?: HydrateDocumentOptions): Promise<HydrateResults>;`
  ];

  const outputPath = path.join(HYDRATE_DIST_DIR, `index.d.ts`);
  await fs.writeFile(outputPath, output.join('\n'));
}


async function bundleHydratePlatform() {
  const rollupBuild = await rollup.rollup({
    input: PLATFORM_INDEX_FILE,
    plugins: [
      {
        resolveId(importee) {
          if (importee === '@runtime') {
            return {
              id: '@stencil/core/runtime',
              external: true
            };
          }
          if (importee === '@platform') {
            return PLATFORM_INDEX_FILE;
          }
        }
      },
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

  const { output } = await rollupBuild.generate({
    format: 'esm',
    file: 'platform.mjs'
  });

  const filePath = path.join(HYDRATE_DIST_DIR, output[0].fileName);
  const outputText = updateBuildIds(output[0].code);
  await fs.writeFile(filePath, outputText);
}


run(async () => {
  transpile(path.join('..', 'src', 'hydrate', 'tsconfig.json'))

  await fs.emptyDir(HYDRATE_DIST_DIR);

  await Promise.all([
    bundleHydrateRunner(),
    generateHydrateDts(),
    bundleHydratePlatform()
  ]);

  await fs.remove(TRANSPILED_DIR);
});
