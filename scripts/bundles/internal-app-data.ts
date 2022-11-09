import fs from 'fs-extra';
import { join } from 'path';
import { RollupOptions } from 'rollup';

import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';

export async function internalAppData(opts: BuildOptions) {
  const inputAppDataDir = join(opts.buildDir, 'app-data');
  const outputInternalAppDataDir = join(opts.output.internalDir, 'app-data');

  await fs.emptyDir(outputInternalAppDataDir);

  // copy @stencil/core/internal/app-data/index.d.ts
  await fs.copyFile(join(inputAppDataDir, 'index.d.ts'), join(outputInternalAppDataDir, 'index.d.ts'));

  // write @stencil/core/internal/app-data/package.json
  writePkgJson(opts, outputInternalAppDataDir, {
    name: '@stencil/core/internal/app-data',
    description: 'Used for default app data and build conditionals within builds.',
    main: 'index.cjs',
    module: 'index.js',
    types: 'index.d.ts',
    sideEffects: false,
  });

  const internalAppDataBundle: RollupOptions = {
    input: {
      index: join(inputAppDataDir, 'index.js'),
    },
    output: [
      {
        format: 'esm',
        dir: outputInternalAppDataDir,
        entryFileNames: '[name].js',
        preferConst: true,
      },
      {
        format: 'cjs',
        dir: outputInternalAppDataDir,
        entryFileNames: '[name].cjs',
        esModule: false,
        preferConst: true,
      },
    ],
  };

  return internalAppDataBundle;
}
