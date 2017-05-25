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

const BUNDLES = [
  { components: ['ion-app', 'ion-content', 'ion-navbar', 'ion-title', 'ion-toolbar'] },
  { components: ['ion-avatar', 'ion-thumbnail'] },
  { components: ['ion-badge'] },
  { components: ['ion-button'] },
  { components: ['ion-card', 'ion-card-content', 'ion-card-header', 'ion-card-title'] },
  { components: ['ion-list', 'ion-item', 'ion-label'] },
  { components: ['ion-list-header', 'ion-item-divider'] },
  { components: ['ion-menu'], priority: 'low' },
  { components: ['ion-modal', 'ion-modal-controller'] },
  { components: ['ion-gesture', 'ion-scroll'], priority: 'low' },
  { components: ['ion-toggle'] },
  { components: ['ion-slides', 'ion-slide'] },
  { components: ['fiber-demo', 'fiber-triangle', 'fiber-dot'] },
];


import { buildBindingCore, LICENSE, readFile, writeFile } from './build-core';
import * as fs from 'fs-extra';
import * as nodeSass from 'node-sass';
import * as path from 'path';
import * as rollup from 'rollup';
import * as typescript from 'typescript';
import * as uglify from 'uglify-js';
import * as ncp from 'ncp';


// dynamic require cuz this file gets transpiled to dist/
const compiler = require(path.join(__dirname, '../compiler'));

const srcDir = path.join(__dirname, '../../src');
const transpiledSrcDir = path.join(__dirname, '../transpiled-web/bindings/web/src');
const compiledDir = path.join(__dirname, '../compiled-ionic-web');
const destDir = path.join(__dirname, '../ionic-web');

// first clean out the ionic-web directories
fs.emptyDirSync(destDir);
fs.emptyDirSync(compiledDir);

// copy vendor JS directory to the compiled ionic-angular location
const vendorJsScript = path.join(srcDir, 'vendor');
const vendorCompilerDest = path.join(compiledDir, 'vendor');

copyDirectory(vendorJsScript, vendorCompilerDest)
.then(() => {
  console.log('build-web core, copy vendor directory from:', vendorJsScript);
  console.log('build-web core, copy vendor directory to:', vendorCompilerDest);
}).then(() => {
  // find all the source components and compile
  // them into reusable components, and create a manifest.json
  // where all the components can be found, and their styles.
  return compileComponents();

}).then(() => {
  // build all of the core files for ionic-web
  // the core files are what makes up how ionic-core "works"
  return buildBindingCore(transpiledSrcDir, compiledDir, 'core', DEV_MODE)

}).then(() => {
  // bundle all of the components into their separate files
  return bundleComponents().then(results => {

    // build the ionic.js loader file which
    // ionic-web uses to decide which core files to load
    // then prepend the component registry to the top of the loader file
    return buildWebLoader(results.componentRegistry, DEV_MODE);
  });

}).then(() => {
  // copy ionic.animation.js
  return copyAnimation();

}).catch(err => {
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


const ctx = {};

function compileComponents() {
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
    bundles: BUNDLES,
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


function bundleComponents() {
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


function buildWebLoader(componentRegistry: string, devMode: boolean) {
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


function copyAnimation() {
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


export function copyDirectory(source: string, destionation: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ncp.ncp(source, destionation, { clobber: true }, (err: Error) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
