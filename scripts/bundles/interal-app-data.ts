import fs from 'fs-extra';
import { join } from 'path';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { RollupOptions } from 'rollup';


export async function internalAppData(opts: BuildOptions) {
  const inputAppDataDir = join(opts.transpiledDir, 'app-data');
  const outputInternalAppDataDir = join(opts.output.internalDir, 'app-data');

  await fs.emptyDir(outputInternalAppDataDir);

  // copy @stencil/core/internal/app-data/index.d.ts
  await fs.copyFile(
    join(inputAppDataDir, 'index.d.ts'),
    join(outputInternalAppDataDir, 'index.d.ts')
  );

  // write @stencil/core/internal/app-data/package.json
  writePkgJson(opts, outputInternalAppDataDir, {
    name: '@stencil/core/internal/app-data',
    description: 'Used for default app data and build conditionals within builds.',
    main: 'index.js',
    module: 'index.mjs',
    types: 'index.d.ts'
  });

  const internalAppDataBundle: RollupOptions = {
    input: {
      'index': join(inputAppDataDir, 'index.js')
    },
    output: [
      {
        format: 'esm',
        dir: outputInternalAppDataDir,
        entryFileNames: '[name].mjs',
      },
      {
        format: 'cjs',
        dir: outputInternalAppDataDir,
        entryFileNames: '[name].js',
        esModule: false,
      }
    ] as any
  };

  return internalAppDataBundle;
}
