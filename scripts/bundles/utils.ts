import fs from 'fs-extra';
import { join } from 'path';

import { BuildOptions } from '../utils/options';

/**
 * A nearly-empty bundle which is responsible for copying the typedef files for
 * the `src/utils/` module to the right location (`internal/util.d.ts`)
 *
 * @param opts options set for the Rollup build
 * @returns an (empty) array of Rollup option objects
 */
export async function utils(opts: BuildOptions) {
  await copyUtilsDtsFiles(opts, 'utils');
  // dummy return to agree with type of other bundles
  return [];
}

/**
 * Copy `.d.ts` files built from `src/utils` to `internal/utils` so that types
 * exported from utility modules can be referenced by other typedefs (in
 * particular by our declarations).
 *
 * This function calls itself recursively to handle any sub-directories with
 * `utils`.
 *
 * @param opts options for the rollup build
 * @param utilsPath the path within the typescript build directory from which
 * `.d.ts` files should be copied
 */
const copyUtilsDtsFiles = async (opts: BuildOptions, utilsPath: string) => {
  const files = await fs.readdir(join(opts.buildDir, utilsPath));

  const outputDirPath = join(opts.output.internalDir, utilsPath);
  await fs.ensureDir(outputDirPath);

  await Promise.all(
    files.map(async (fileName: string) => {
      const inputFilePath = join(opts.buildDir, utilsPath, fileName);
      const stat = await fs.stat(inputFilePath);

      if (stat.isFile() && inputFilePath.endsWith('.d.ts')) {
        const buffer = await fs.readFile(inputFilePath);
        // the declarations are all exported by `internal/index.d.ts`, so we
        // can rewrite any import of `src/declarations` from `src/utils` to
        // just point to the directory above `internal/utils` i.e. `internal`
        //
        // so if, for instance, there's an import like
        // `import * as d from '../declarations'`
        // we'd like to transform that to `import * as d from '..'`
        const contents = String(buffer).replace('/declarations', '');
        const outputFilePath = join(opts.output.internalDir, utilsPath, fileName);
        await fs.writeFile(outputFilePath, contents);
      } else if (stat.isDirectory()) {
        // its a directory, recur!
        // since we start with `utilsPath` equal to "utils" we can just join
        // the subdirectory name to that to get an appropriate path fragment
        await copyUtilsDtsFiles(opts, join(utilsPath, fileName));
      }
    })
  );
};
