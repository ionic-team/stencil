import fs from 'fs-extra';
import { join } from 'path';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { inlinedCompilerPluginsPlugin } from './plugins/inlined-compiler-plugins-plugin';
import { optimizeCssPlugin } from './plugins/optimizecss-plugin';
import { sysModulesPlugin } from './plugins/sys-modules-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { getBanner } from '../utils/banner';
import { writePkgJson } from '../utils/write-pkg-json';
import { BuildOptions } from '../utils/options';
import { RollupOptions, OutputChunk } from 'rollup';
import terser from 'terser';


export async function compiler(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'compiler_next');

  const compilerFileName = 'stencil.js';
  const compilerDtsName = compilerFileName.replace('.js', '.d.ts');

  // copy @stencil/core/compiler public d.ts
  await fs.copyFile(
    join(inputDir, 'public.d.ts'),
    join(opts.output.compilerDir, compilerDtsName)
  );

  // write @stencil/core/compiler/package.json
  writePkgJson(opts, opts.output.compilerDir, {
    name: '@stencil/core/compiler',
    description: 'Stencil Compiler.',
    main: compilerFileName,
    types: compilerDtsName
  });


  const compilerIntro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-intro.js'), 'utf8');
  const cjsIntro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-intro.js'), 'utf8');
  const cjsOutro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-outro.js'), 'utf8');


  const compilerBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.compilerDir, compilerFileName),
      intro: cjsIntro + compilerIntro,
      outro: cjsOutro,
      strict: false,
      banner: getBanner(opts, 'Stencil Compiler', true),
      esModule: false,
    },
    plugins: [
      {
        resolveId(id) {
          if (id === '@mock-doc') {
            return join(opts.transpiledDir, 'mock-doc', 'index.js');
          }
          return null;
        }
      },
      optimizeCssPlugin(opts),
      inlinedCompilerPluginsPlugin(opts, inputDir),
      aliasPlugin(opts),
      sysModulesPlugin(inputDir),
      nodeResolve({
        preferBuiltins: false
      }),
      commonjs(),
      replacePlugin(opts),
      json() as any,
      {
        generateBundle(_, bundleFiles) {
          Object.keys(bundleFiles).forEach(fileName => {
            if (opts.isProd) {
              const bundle = bundleFiles[fileName] as OutputChunk;
              bundle.code = minifyStencilCompiler(bundle.code)
            }
          });
        }
      }
    ],
    treeshake: {
      moduleSideEffects: false
    }
  };

  return [
    compilerBundle,
  ];
};


function minifyStencilCompiler(code: string) {
  const minifyResults = terser.minify(code, {
    ecma: 7,
    compress: {
      passes: 2,
      ecma: 7,
    },
    output: {
      ecma: 7,
    }
  });

  if (minifyResults.error) {
    throw minifyResults.error;
  }

  return minifyResults.code;
}
