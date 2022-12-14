import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import MagicString from 'magic-string';
import { join } from 'path';
import type { OutputChunk, RollupOptions, RollupWarning, TransformResult } from 'rollup';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { minify, MinifyOptions } from 'terser';

import { getBanner } from '../utils/banner';
import { getTypeScriptDefaultLibNames } from '../utils/dependencies-json';
import type { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { inlinedCompilerDepsPlugin } from './plugins/inlined-compiler-deps-plugin';
import { parse5Plugin } from './plugins/parse5-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { sizzlePlugin } from './plugins/sizzle-plugin';
import { sysModulesPlugin } from './plugins/sys-modules-plugin';
import { terserPlugin } from './plugins/terser-plugin';
import { typescriptSourcePlugin } from './plugins/typescript-source-plugin';

/**
 * Generates a rollup configuration for the `compiler` submodule of the project
 * @param opts the options being used during a build of the Stencil compiler
 * @returns an array containing the generated rollup options
 */
export async function compiler(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'compiler');

  const compilerFileName = 'stencil.js';
  const compilerDtsName = compilerFileName.replace('.js', '.d.ts');

  // create public d.ts
  let dts = await fs.readFile(join(inputDir, 'public.d.ts'), 'utf8');
  dts = dts.replace('@stencil/core/internal', '../internal/index');
  await fs.writeFile(join(opts.output.compilerDir, compilerDtsName), dts);

  // write @stencil/core/compiler/package.json
  writePkgJson(opts, opts.output.compilerDir, {
    name: '@stencil/core/compiler',
    description: 'Stencil Compiler.',
    main: compilerFileName,
    types: compilerDtsName,
  });

  // copy and edit compiler/sys/in-memory-fs.d.ts
  let inMemoryFsDts = await fs.readFile(join(inputDir, 'sys', 'in-memory-fs.d.ts'), 'utf8');
  inMemoryFsDts = inMemoryFsDts.replace('@stencil/core/internal', '../../internal/index');
  await fs.mkdir(join(opts.output.compilerDir, 'sys'));
  await fs.writeFile(join(opts.output.compilerDir, 'sys', 'in-memory-fs.d.ts'), inMemoryFsDts);

  // copy and edit compiler/transpile.d.ts
  let transpileDts = await fs.readFile(join(inputDir, 'transpile.d.ts'), 'utf8');
  transpileDts = transpileDts.replace('@stencil/core/internal', '../internal/index');
  await fs.writeFile(join(opts.output.compilerDir, 'transpile.d.ts'), transpileDts);

  /**
   * These files are wrap the compiler in an Immediately-Invoked Function Expression (IIFE). The intro contains the
   * first half of the IIFE, and the outro contains the second half. Those files are not valid JavaScript on their own,
   * and editors may produce warnings as a result. This comment is not in the files themselves, as doing so would lead
   * to the comment being added to the compiler output itself. These files could be converted to non-JS files, at the
   * cost of losing some source code highlighting in editors.
   */
  const cjsIntro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-intro.js'), 'utf8');
  const cjsOutro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-outro.js'), 'utf8');

  const rollupWatchPath = join(opts.nodeModulesDir, 'rollup', 'dist', 'es', 'shared', 'watch.js');
  const compilerBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.compilerDir, compilerFileName),
      intro: cjsIntro,
      outro: cjsOutro,
      strict: false,
      banner: getBanner(opts, `Stencil Compiler`, true),
      esModule: false,
      preferConst: true,
      freeze: false,
      sourcemap: true,
    },
    plugins: [
      typescriptSourcePlugin(opts),
      terserPlugin(opts),
      {
        name: 'compilerMockDocResolvePlugin',
        /**
         * A rollup build hook for resolving the Stencil mock-doc module, Microsoft's TypeScript event tracer, and the
         * V8 inspector. [Source](https://rollupjs.org/guide/en/#resolveid)
         * @param id the importee exactly as it is written in an import statement in the source code
         * @returns an object that resolves an import to some id
         */
        resolveId(id: string): string | null {
          if (id === '@stencil/core/mock-doc') {
            return join(opts.buildDir, 'mock-doc', 'index.js');
          }
          if (id === '@microsoft/typescript-etw' || id === 'inspector') {
            return id;
          }
          return null;
        },
      },
      {
        name: 'rollupResolvePlugin',
        /**
         * A rollup build hook for resolving the fsevents. [Source](https://rollupjs.org/guide/en/#resolveid)
         * @param id the importee exactly as it is written in an import statement in the source code
         * @returns an object that resolves an import to some id
         */
        resolveId(id: string): string | null {
          if (id === 'fsevents') {
            return id;
          }
          return null;
        },
        /**
         * A rollup build hook for loading the Stencil mock-doc module, Microsoft's TypeScript event tracer, the V8
         * inspector and fsevents. [Source](https://rollupjs.org/guide/en/#load)
         * @param id the path of the module to load
         * @returns the module matched
         */
        load(id: string): string | null {
          if (id === 'fsevents' || id === '@microsoft/typescript-etw' || id === 'inspector') {
            return '';
          }
          if (id === rollupWatchPath) {
            return '';
          }
          return null;
        },
      },
      replacePlugin(opts),
      {
        name: 'hackReplaceNodeProcessBinding',
        /**
         * Removes instances of calls to deprecated `process.binding()` calls
         * @param code the code to modify
         * @param id module's identifier
         * @returns the modified code
         */
        transform(code: string, id: string): TransformResult {
          code = code.replace(` || Object.keys(process.binding('natives'))`, '');
          return {
            code: code,
            map: new MagicString(code)
              .generateMap({
                source: id,
                // this is the name of the sourcemap, not to be confused with the `file` field in a generated sourcemap
                file: id + '.map',
                includeContent: false,
                hires: true,
              })
              .toString(),
          };
        },
      },
      inlinedCompilerDepsPlugin(opts, inputDir),
      parse5Plugin(opts),
      sizzlePlugin(opts),
      aliasPlugin(opts),
      sysModulesPlugin(inputDir),
      rollupNodeResolve({
        mainFields: ['module', 'main'],
        preferBuiltins: false,
      }),
      rollupCommonjs({
        transformMixedEsModules: false,
        sourceMap: true,
      }),
      rollupJson({
        preferConst: true,
      }),
      {
        name: 'compilerMinify',
        async generateBundle(_, bundleFiles) {
          if (opts.isProd) {
            const compilerFilename = Object.keys(bundleFiles).find((f) => f.includes('stencil'));
            const compilerBundle = bundleFiles[compilerFilename] as OutputChunk;
            const minified = await minifyStencilCompiler(compilerBundle.code, opts);
            await fs.writeFile(join(opts.output.compilerDir, compilerFilename.replace('.js', '.min.js')), minified);
          }
        },
      },
      sourcemaps(),
    ],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },
    onwarn(warning: RollupWarning) {
      if (warning.code === `THIS_IS_UNDEFINED`) {
        return;
      }
      console.warn(warning.message || warning);
    },
  };

  // copy typescript default lib dts files
  const tsLibNames = await getTypeScriptDefaultLibNames(opts);

  await Promise.all(tsLibNames.map((f) => fs.copy(join(opts.typescriptLibDir, f), join(opts.output.compilerDir, f))));

  return [compilerBundle];
}

async function minifyStencilCompiler(code: string, opts: BuildOptions) {
  const minifyOpts: MinifyOptions = {
    ecma: 2018,
    compress: {
      ecma: 2018,
      passes: 2,
      side_effects: false,
      unsafe_arrows: true,
      unsafe_methods: true,
    },
    format: {
      ecma: 2018,
      comments: false,
    },
  };

  const results = await minify(code, minifyOpts);

  code = getBanner(opts, `Stencil Compiler`, true) + '\n' + results.code;

  return code;
}
