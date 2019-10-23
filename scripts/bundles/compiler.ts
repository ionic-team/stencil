import fs from 'fs-extra';
import { join } from 'path';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { inlinedCompilerPluginsPlugin } from './plugins/inlined-compiler-plugins-plugin';
import { sysModulesPlugin } from './plugins/sys-modules-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { getBanner } from '../utils/banner';
import { writePkgJson } from '../utils/write-pkg-json';
import { BuildOptions } from '../utils/options';
import { RollupOptions } from 'rollup';


export async function compiler(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'compiler_next');

  const compilerFileName = 'stencil.js';
  const browserFileName = 'stencil-browser.js';
  const compilerDtsName = compilerFileName.replace('.js', '.d.ts');
  const browserDtsName = browserFileName.replace('.js', '.d.ts');

  // copy @stencil/core/compiler(core) public d.ts
  await fs.copyFile(
    join(inputDir, 'public-core.d.ts'),
    join(opts.output.compilerDir, compilerDtsName)
  );

  // copy @stencil/core/compiler(browser) public d.ts
  await fs.copyFile(
    join(inputDir, 'public-browser.d.ts'),
    join(opts.output.compilerDir, browserDtsName)
  );

  // write @stencil/core/compiler/package.json
  writePkgJson(opts, opts.output.compilerDir, {
    name: '@stencil/core/compiler',
    description: 'Stencil Compiler.',
    main: compilerFileName,
    browser: browserFileName,
    types: compilerDtsName
  });


  const compilerIntro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-intro.js'), 'utf8');
  const cjsIntro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-intro.js'), 'utf8');
  const cjsOutro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-outro.js'), 'utf8');


  const coreCompilerBundle: RollupOptions = {
    input: join(inputDir, 'index-core.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.compilerDir, compilerFileName),
      intro: cjsIntro + compilerIntro,
      outro: cjsOutro,
      strict: false,
      banner: getBanner(opts, 'Stencil Compiler')
    },
    plugins: [
      inlinedCompilerPluginsPlugin(opts, inputDir),
      aliasPlugin(opts),
      sysModulesPlugin(inputDir),
      nodeResolve({
        preferBuiltins: false
      }),
      commonjs(),
      replacePlugin(opts),
      json() as any,
    ],
    treeshake: {
      moduleSideEffects: false
    }
  };


  // browser compiler build
  const browserCompilerBundle: RollupOptions = {
    input: join(inputDir, 'index-browser.js'),
    output: {
      format: 'es',
      file: join(opts.output.compilerDir, browserFileName),
      banner: getBanner(opts, 'Stencil Browser Compiler - ' + browserFileName)
    },
    plugins: [
      aliasPlugin(opts),
      sysModulesPlugin(inputDir),
      nodeResolve({
        preferBuiltins: false
      }),
      commonjs(),
      replacePlugin(opts),
      json() as any,
    ]
  };

  return [
    coreCompilerBundle,
    browserCompilerBundle
  ];
};
