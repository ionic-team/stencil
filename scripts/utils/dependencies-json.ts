import { readdir, readFile, writeFile } from 'fs-extra';
import { join } from 'path';

import type { BuildOptions } from './options';

/**
 * This function updates/writes `dependencies.json` file(s) on disk, using a template file found in the Stencil source
 * code.
 * @param opts the build options for Stencil when building the compiler
 */
export async function updateDependenciesJson(opts: BuildOptions): Promise<void> {
  // determine the location of the template file
  const srcPath = join(opts.srcDir, 'compiler', 'sys', 'dependencies.json');
  // determine the destination path of `dependencies.json`
  const rootPath = join(opts.rootDir, 'dependencies.json');

  // get a list of stencil files + typescript compiler type declarations to add to the bundle
  const stencilResources = await getStencilResources(opts);

  const data = JSON.parse(await readFile(srcPath, 'utf8'));
  for (const dep of data.dependencies) {
    if (dep.name === '@stencil/core') {
      dep.resources = stencilResources;
    }
  }
  // update the src file, which most of the time is no change
  // but! in case there _is_ a change we'll then know to commit it.
  // Cases of updating this file often occur as a result of upgrading TypeScript.
  // `git blame` in the file that `srcPath` resolves to demonstrate cases such as this.
  await writeFile(srcPath, JSON.stringify(data, null, 2));

  // now update the versions and write a copy for the root
  for (const dep of data.dependencies) {
    switch (dep.name) {
      case '@stencil/core':
        dep.version = opts.version;
        break;
      case 'rollup':
        dep.version = opts.rollupVersion;
        break;
      case 'terser':
        dep.version = opts.terserVersion;
        break;
      case 'typescript':
        dep.version = opts.typescriptVersion;
        break;
    }
  }

  await writeFile(rootPath, JSON.stringify(data, null, 2));
}

/**
 * Generate a list of Stencil resources (and TypeScript files) to use in creating the compiler bundle
 * @param opts the Stencil build options to use to generate this list
 * @returns a sorted list of Stencil resources
 */
async function getStencilResources(opts: BuildOptions): Promise<string[]> {
  const tsLibPaths = (await getTypeScriptDefaultLibNames(opts)).map((f) => `compiler/${f}`);

  const resources: string[] = [
    'internal/index.js',
    'internal/index.d.ts',
    'internal/package.json',
    'internal/stencil-core/index.js',
    'internal/stencil-core/index.d.ts',
    'internal/stencil-ext-modules.d.ts',
    'internal/stencil-private.d.ts',
    'internal/stencil-public-compiler.d.ts',
    'internal/stencil-public-docs.d.ts',
    'internal/stencil-public-runtime.d.ts',
    'internal/client/css-shim.js',
    'internal/client/dom.js',
    'internal/client/index.js',
    'internal/client/patch-browser.js',
    'internal/client/patch-esm.js',
    'internal/client/shadow-css.js',
    'internal/client/package.json',
    'internal/hydrate/index.js',
    'internal/hydrate/runner.js',
    'internal/hydrate/shadow-css.js',
    'internal/hydrate/package.json',
    'mock-doc/index.js',
    'mock-doc/package.json',
    'package.json',
    ...tsLibPaths,
  ];

  return resources.sort((a, b) => {
    const dirsA = a.split('/').length;
    const dirsB = b.split('/').length;
    if (dirsA < dirsB) return -1;
    if (dirsA > dirsB) return 1;
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
  });
}

/**
 * Helper function that reads in the `lib.*.d.ts` files in the TypeScript lib/ directory on disk.
 * @param opts the Stencil build options, which includes the location of the TypeScript lib/
 * @returns all file names that match the `lib.*.d.ts` format
 */
export async function getTypeScriptDefaultLibNames(opts: BuildOptions): Promise<string[]> {
  const tsLibNames: string[] = (await readdir(opts.typescriptLibDir)).filter((f) => {
    return f.startsWith('lib.') && f.endsWith('.d.ts');
  });
  return tsLibNames;
}
