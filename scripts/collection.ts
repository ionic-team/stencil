/**
 * Build Web:
 * First build the core files for specifically ionic-web, and
 * create manifest.json with all meta data about each component.
 *
 * Bundle up all of the compiled ionic components, using the
 * newly created manifest.json as a guide, and create a bunch of
 * bundled js files which include each component.
 *
 * It'll also create "ionic.js", which is the base "loader" file
 * that decides which core file/polyfills it needs. The ionic-angular
 * project doesn't need a "loader" because it's built within
 * the initial ionic providers during bootstrap.
 */

const DEV_MODE = process.argv.indexOf('dev') > -1;
const WATCH = process.argv.indexOf('watch') > -1;

import * as fs from 'fs-extra';
import * as nodeSass from 'node-sass';
import * as path from 'path';
import * as rollup from 'rollup';
import * as typescript from 'typescript';

export type Bundle = {
  components: string[];
  priority?: 'low'
}
export type StencilConfig = {
  src: string;
  dest: string;
  bundles: Bundle[]
}

const compiler = require(path.join(__dirname, '..' , 'compiler'));

export function run(pargv: string[], env: { [k: string]: string }) {
  pargv; env;
  const projectBase = process.cwd();
  const projectConfig = path.join(projectBase, 'stencil.config');
  const data: StencilConfig = require(projectConfig).config;
  const srcDir = path.join(projectBase, data.src);
  const destDir = path.join(projectBase, data.dest);

  const bundles = data.bundles;

  // dynamic require cuz this file gets transpiled to dist/
  const ctx = {};

  // first clean out the ionic-web directories
  // fs.emptyDirSync(destDir);


  // find all the source components and compile
  // them into reusable components, and create a manifest.json
  // where all the components can be found, and their styles.
  compileComponents(ctx, destDir, srcDir, bundles)

  .catch(err => {
    if (err) {
      if (err.stack) {
        console.error('build.web', err.stack);
      } else {
        console.error('build.web', err);
      }
    } else {
      console.error('build.web error');
    }
  });
}



function compileComponents(ctx, compiledDir: string, srcDir: string, bundles) {
  const config = {
    compilerOptions: {
      outDir: compiledDir,
      module: 'commonjs',
      target: 'es5',
      rootDir: srcDir
    },
    include: [srcDir],
    exclude: ['node_modules', 'compiler', 'test'],
    devMode: DEV_MODE,
    debug: true,
    bundles: bundles,
    watch: WATCH,
    packages: {
      fs: fs,
      path: path,
      nodeSass: nodeSass,
      rollup: rollup,
      typescript: typescript
    }
  };

  return compiler.compile(config, ctx);
}
