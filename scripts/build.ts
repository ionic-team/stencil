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

import { buildBindingCore, LICENSE, readFile, writeFile } from './build-core';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import * as nodeSass from 'node-sass';
import * as path from 'path';
import * as rollup from 'rollup';
import * as typescript from 'typescript';
import * as uglify from 'uglify-js';

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
  const transpiledSrcDir = path.join(__dirname, '../transpiled-web/bindings/web/src');
  const compiledDir = path.join(projectBase, 'temp');

  // first clean out the ionic-web directories
  // fs.emptyDirSync(destDir);


  // find all the source components and compile
  // them into reusable components, and create a manifest.json
  // where all the components can be found, and their styles.
  compileComponents(ctx, compiledDir, srcDir, bundles).then(() => {

    // build all of the core files for ionic-web
    // the core files are what makes up how ionic-core "works"
    return buildBindingCore(transpiledSrcDir, compiledDir, 'core', DEV_MODE)

  }).then(() => {
    // bundle all of the components into their separate files
    return bundleComponents(ctx, compiledDir, destDir).then(results => {

      // build the ionic.js loader file which
      // ionic-web uses to decide which core files to load
      // then prepend the component registry to the top of the loader file
      return buildWebLoader(results.componentRegistry, DEV_MODE, transpiledSrcDir, destDir);
    });

  }).then(() => {

    // Copy built animation file
    return copyAnimation(compiledDir, destDir);
  }).then(() => {

    // Remove temp compiled dir
    fs.removeSync(compiledDir);
  }).catch(err => {
    if (err) {
      if (err.stack) {
        console.error(chalk.red('ERROR:'), ' build.web', err.stack);
      } else {
        console.error(chalk.red('ERROR:'), ' build.web', err);
      }
    } else {
      console.error(chalk.red('ERROR: '), 'build.web unknown error');
    }
  });
}



function compileComponents(ctx, compiledDir: string, srcDir: string, bundles) {
  const config = {
    compilerOptions: {
      outDir: compiledDir,
      module: 'commonjs',
      target: 'es5'
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


function bundleComponents(ctx, compiledDir: string, destDir: string) {
  const config = {
    srcDir: compiledDir,
    destDir: destDir,
    packages: {
      fs: fs,
      path: path,
      rollup: rollup,
      uglify: uglify,
      nodeSass: nodeSass,
      typescript: typescript
    },
    devMode: DEV_MODE,
    watch: WATCH,
    debug: true
  };

  return compiler.bundle(config, ctx);
}


function buildWebLoader(componentRegistry: string, devMode: boolean, transpiledSrcDir: string, destDir: string) {
  const loaderSrcPath = path.join(transpiledSrcDir, 'ionic.js');
  const loaderDestPath = path.join(destDir, 'ionic.js');

  return readFile(loaderSrcPath).then(srcLoaderJs => {
    componentRegistry = `(window.Ionic=window.Ionic||{}).components=${componentRegistry};`;

    if (devMode) {
      const content = [
        LICENSE,
        componentRegistry,
        srcLoaderJs
      ].join('\n');

      return writeFile(loaderDestPath, content);
    }

    return writeFile(loaderDestPath, srcLoaderJs).then(() => {
      const ClosureCompiler = require('google-closure-compiler').compiler;

      return new Promise((resolve, reject) => {
        const opts = {
          js: loaderDestPath,
          language_out: 'ECMASCRIPT5',
          warning_level: 'QUIET',
          rewrite_polyfills: 'false',
          // formatting: 'PRETTY_PRINT',
          // debug: 'true'
        };

        var closureCompiler = new ClosureCompiler(opts);

        closureCompiler.run((exitCode: number, stdOut: string, stdErr: string) => {
          if (stdErr) {
            console.log('buildLoader closureCompiler, exitCode', exitCode, 'stdErr', stdErr);
            reject();

          } else {
            const content = [
              LICENSE,
              componentRegistry,
              stdOut
            ].join('\n');

            writeFile(loaderDestPath, content).then(() => {
              resolve();
            });
          }
        });
      });
    });
  });
}

function copyAnimation(compiledDir: string, destDir: string) {
  return new Promise((resolve, reject) => {
    const srcName = DEV_MODE ? 'ionic.animation.dev.js' : 'ionic.animation.js';
    const src = path.join(compiledDir, 'core', srcName);
    const dest = path.join(destDir, 'ionic.animation.js');

    fs.copy(src, dest, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
