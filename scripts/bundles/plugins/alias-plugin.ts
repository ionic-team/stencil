import { join } from 'path';
import type { PartialResolvedId, Plugin } from 'rollup';
import { CompilerOptions, nodeModuleNameResolver, parseConfigFileTextToJson, sys } from 'typescript';

import type { BuildOptions } from '../../utils/options';

/**
 * Creates a rollup plugin for resolving identifiers while simultaneously externalizing them
 * @param opts the options being used during a build
 * @returns a rollup plugin with a build hook for resolving various identifiers
 */
export function aliasPlugin(opts: BuildOptions): Plugin {
  const alias = new Map([
    ['@app-data', '@stencil/core/internal/app-data'],
    ['@app-globals', '@stencil/core/internal/app-globals'],
    ['@hydrate-factory', '@stencil/core/hydrate-factory'],
    ['@stencil/core/mock-doc', '@stencil/core/mock-doc'],
    ['@stencil/core/testing', '@stencil/core/testing'],
    ['@sys-api-node', './index.js'],
    ['@dev-server-process', './server-process.js'],
  ]);

  // ensure we use the same one
  const helperResolvers = new Set(['is-resolvable', 'path-is-absolute']);

  // ensure we use the same one
  const nodeResolvers = new Map([['source-map', join(opts.nodeModulesDir, 'source-map', 'source-map.js')]]);

  const empty = new Set([
    // we never use chalk, but many projects still pull it in
    'chalk',
  ]);

  const compilerOptions = getTsCompilerOptions();
  const { outDir, paths } = compilerOptions;

  return {
    name: 'aliasPlugin',
    /**
     * A rollup build hook for resolving identifiers. See Rollup's
     * documentation here: https://rollupjs.org/guide/en/#resolveid
     *
     * This plugin takes care of:
     *
     * 1. Marking some modules as external so imports from them aren't bundled
     * 2. Ensuring that for some modules we always import the same one
     * 3. Resolving the module aliases we set in `tsconfig.json` to the
     * correct path to the corresponding compiled output
     *
     * @param importee the importee exactly as it is written in an import
     * statement in the source code
     * @param importer the path to the module which imports the importee
     * @returns a resolution to an import to a different id, potentially
     * externalizing it from the bundle simultaneously
     */
    resolveId(importee: string, importer: string): PartialResolvedId | string | null {
      // this indicates it's a 'virtual' module created by Rollup
      if (typeof importer === 'undefined' || importee.startsWith('\0')) {
        return null;
      }

      // if a module is on our list of 'blessed' external modules we mark it as such
      const externalId = alias.get(importee);
      if (externalId) {
        return {
          id: externalId,
          external: true,
        };
      }

      if (helperResolvers.has(importee)) {
        return join(opts.bundleHelpersDir, `${importee}.js`);
      }
      if (empty.has(importee)) {
        return join(opts.bundleHelpersDir, 'empty.js');
      }
      if (nodeResolvers.has(importee)) {
        return nodeResolvers.get(importee);
      }

      const hasMatchingPath = Object.keys(paths).some((path) => importee.includes(path));

      // starting with '.' indicates this is a normal relative import, we don't
      // need to do anything with that, and if we didn't match any of the paths
      // defined in `tsconfig.json` we likewise don't need to do anything
      if (importee.startsWith('.') || !hasMatchingPath) {
        return null;
      }

      const { resolvedModule } = nodeModuleNameResolver(importee, importer, compilerOptions, sys);

      let { resolvedFileName } = resolvedModule;

      if (!resolvedFileName || resolvedFileName.endsWith('.d.ts')) {
        // we don't resolve `.d.ts` files because that could result in a JS file trying to import one...
        return null;
      }

      // something like src/foodir/dir.ts will be the resolved filename, so we
      // slice the `src/` off the beginning
      if (LEADING_SRC_REGEX.test(resolvedFileName)) {
        resolvedFileName = resolvedFileName.replace(LEADING_SRC_REGEX, '');
      }

      const pathToCompiledImportee = join(outDir, resolvedFileName.replace(/\.tsx?$/i, '.js'));

      return sys.resolvePath(pathToCompiledImportee);
    },
  };
}

/**
 * A regular expression helpful for matching relative paths that start with
 * 'src/', like 'src/foo/bar.ts'.
 */
const LEADING_SRC_REGEX = /^src\//;

/**
 * Read the project's `tsconfig.json` and return the {@link CompilerOptions}
 * that we define therein.
 *
 * @returns the compiler options that we set for typescript
 */
const getTsCompilerOptions = (): CompilerOptions => {
  const configJson = sys.readFile('./tsconfig.json');

  const { config } = parseConfigFileTextToJson('./tsconfig.json', configJson);
  const { compilerOptions } = config;

  return compilerOptions;
};
