import fs from 'fs-extra';
import { join } from 'path';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
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
import { RollupOptions } from 'rollup';
import terser from 'terser';


export async function compiler(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'compiler_next');

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
    types: compilerDtsName
  });


  const cjsIntro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-intro.js'), 'utf8');
  const cjsOutro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-outro.js'), 'utf8');


  const compilerBundle: RollupOptions = {
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
        resolveId(id) {
          if (id === '@stencil/core/mock-doc') {
            return join(opts.transpiledDir, 'mock-doc', 'index.js');
          }
          return null;
        }
      },
      inlinedCompilerPluginsPlugin(opts, inputDir),
      parse5Plugin(opts),
      sizzlePlugin(opts),
      aliasPlugin(opts),
      sysModulesPlugin(inputDir),
      nodeResolve({
        preferBuiltins: false
      }),
      commonjs(),
      replacePlugin(opts),
      json() as any,
      moduleDebugPlugin(opts),
      // {
      //   generateBundle(_, bundleFiles) {
      //     Object.keys(bundleFiles).forEach(fileName => {
      //       if (opts.isProd) {
      //         const bundle = bundleFiles[fileName] as OutputChunk;
      //         bundle.code = minifyStencilCompiler(bundle.code)
      //       }
      //     });
      //   }
      // }
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
  const opts: terser.MinifyOptions = {
    ecma: 7,
    compress: {
      passes: 2,
      ecma: 7,
    },
    output: {
      ecma: 7,
    }
  };

  const minifyResults = terser.minify(code, opts);

  if (minifyResults.error) {
    throw minifyResults.error;
  }

  return minifyResults.code;
}
