import fs from 'fs-extra';
import { join } from 'path';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import { aliasPlugin } from './plugins/alias-plugin';
import { getBanner } from '../utils/banner';
import { inlinedCompilerDepsPlugin } from './plugins/inlined-compiler-deps-plugin';
import { moduleDebugPlugin } from './plugins/module-debug-plugin';
import { parse5Plugin } from './plugins/parse5-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { sizzlePlugin } from './plugins/sizzle-plugin';
import { sysModulesPlugin } from './plugins/sys-modules-plugin';
import { writePkgJson } from '../utils/write-pkg-json';
import { BuildOptions } from '../utils/options';
import { RollupOptions, OutputChunk } from 'rollup';
import { typescriptSourcePlugin } from './plugins/typescript-source-plugin';
import terser from 'terser';

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
      sourcemap: false,
    },
    plugins: [
      typescriptSourcePlugin(opts),
      {
        name: 'compilerMockDocResolvePlugin',
        resolveId(id) {
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
        resolveId(id) {
          if (id === 'fsevents') {
            return id;
          }
        },
        load(id) {
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
        name: 'hackReplace',
        transform(code) {
          code = code.replace(` || Object.keys(process.binding('natives'))`, '');
          return code;
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
      }),
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
            const minified = minifyStencilCompiler(compilerBundle.code, opts);
            await fs.writeFile(join(opts.output.compilerDir, compilerFilename.replace('.js', '.min.js')), minified);
          }
        },
      },
    ],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },
    onwarn(warning) {
      if (warning.code === `THIS_IS_UNDEFINED`) {
        return;
      }
      console.warn(warning.message || warning);
    },
  };

  // copy typescript default lib dts files
  const dtsFiles = (await fs.readdir(opts.typescriptLibDir)).filter(f => {
    return f.startsWith('lib.') && f.endsWith('.d.ts');
  });

  await Promise.all(dtsFiles.map(f => fs.copy(join(opts.typescriptLibDir, f), join(opts.output.compilerDir, f))));

  return [compilerBundle];
}

function minifyStencilCompiler(code: string, opts: BuildOptions) {
  const minifyOpts: terser.MinifyOptions = {
    ecma: 2018,
    compress: {
      ecma: 2018,
      passes: 2,
      side_effects: false,
      unsafe_arrows: true,
      unsafe_methods: true,
    },
    output: {
      ecma: 2018,
      comments: false,
    },
  };

  const results = terser.minify(code, minifyOpts);

  if (results.error) {
    throw results.error;
  }

  code = getBanner(opts, `Stencil Compiler`, true) + '\n' + results.code;

  return code;
}
