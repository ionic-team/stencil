import fs from 'fs-extra';
import { join } from 'path';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import { aliasPlugin } from './plugins/alias-plugin';
import { getBanner } from '../utils/banner';
import { inlinedCompilerPluginsPlugin } from './plugins/inlined-compiler-plugins-plugin';
import { moduleDebugPlugin } from './plugins/module-debug-plugin';
import { parse5Plugin } from './plugins/parse5-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { sizzlePlugin } from './plugins/sizzle-plugin';
import { sysModulesPlugin } from './plugins/sys-modules-plugin';
import { writePkgJson } from '../utils/write-pkg-json';
import { BuildOptions } from '../utils/options';
import { RollupOptions, OutputChunk } from 'rollup';
import terser from 'terser';

export async function compiler(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'compiler');

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

  const cjsIntro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-intro.js'), 'utf8');
  const cjsOutro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-outro.js'), 'utf8');
  const rollupWatchPath = join(opts.nodeModulesDir, 'rollup', 'dist', 'es', 'shared', 'watch.js');  const compilerBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.compilerDir, compilerFileName),
      intro: cjsIntro,
      outro: cjsOutro,
      strict: false,
      banner: getBanner(opts, 'Stencil Compiler', true),
      esModule: false,
      preferConst: true,
    },
    plugins: [
      {
        name: 'compilerMockDocResolvePlugin',
        resolveId(id) {
          if (id === '@stencil/core/mock-doc') {
            return join(opts.transpiledDir, 'mock-doc', 'index.js');
          }
          return null;
        },
      },
      {
        name: 'rollupResolvePlugin',
        resolveId(id) {
          if (id === 'fsevents') {
            return id;
          }
        },
        load(id) {
          if (id === 'fsevents') {
            return '';
          }
          if (id === rollupWatchPath) {
            return '';
          }
          return null;
        },
      },
      inlinedCompilerPluginsPlugin(opts, inputDir),
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
      }),
      replacePlugin(opts),
      rollupJson({
        preferConst: true,
      }),
      moduleDebugPlugin(opts),
      {
        name: 'compilerMinify',
        async generateBundle(_, bundleFiles) {
          if (opts.isProd) {
            const compilerFilename = Object.keys(bundleFiles).find(f => f.includes('stencil'));
            const compilerBundle = bundleFiles[compilerFilename] as OutputChunk;
            const minified = minifyStencilCompiler(compilerBundle.code);
            await fs.writeFile(join(opts.output.compilerDir, compilerFilename.replace('.js', '.min.js')), minified);
          }
        },
      },
    ],
    treeshake: {
      moduleSideEffects: false,
    },
  };

  return [compilerBundle];
}

function minifyStencilCompiler(code: string) {
  const opts: terser.MinifyOptions = {
    ecma: 7,
    compress: {
      passes: 2,
      ecma: 7,
    },
    output: {
      ecma: 7,
    },
  };

  const minifyResults = terser.minify(code, opts);

  if (minifyResults.error) {
    throw minifyResults.error;
  }

  return minifyResults.code;
}
