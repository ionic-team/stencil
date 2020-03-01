import fs from 'fs-extra';
import { join } from 'path';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { reorderCoreStatementsPlugin } from './plugins/reorder-statements';
import { getBanner } from '../utils/banner';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { RollupOptions, OutputOptions } from 'rollup';


export async function internalTesting(opts: BuildOptions) {
  const inputTestingPlatform = join(opts.transpiledDir, 'testing', 'platform', 'index.js');
  const outputTestingPlatformDir = join(opts.output.internalDir, 'testing');

  await fs.emptyDir(outputTestingPlatformDir);

  // write @stencil/core/internal/testing/package.json
  writePkgJson(opts, outputTestingPlatformDir, {
    name: '@stencil/core/internal/testing',
    description: 'Stencil internal testing platform to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
    main: 'index.js'
  });

  const output: OutputOptions = {
    format: 'cjs',
    dir: outputTestingPlatformDir,
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
    banner: getBanner(opts, 'Stencil Testing Platform'),
    esModule: false,
    preferConst: true,
  };

  const internalTestingPlatformBundle: RollupOptions = {
    input: {
      index: inputTestingPlatform
    },
    output,
    plugins: [
      {
        name: 'internalTestingPlugin',
        resolveId(importee) {
          if (importee === '@platform') {
            return inputTestingPlatform;
          }
          return null;
        }
      },
      aliasPlugin(opts),
      replacePlugin(opts),
      reorderCoreStatementsPlugin(),
    ]
  };

  return [
    internalTestingPlatformBundle
  ];
};
