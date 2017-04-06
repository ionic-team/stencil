/**
 * Build Components:
 * Compiles all of the source Ionic components into reusable
 * ionic components, along with creating a manifest.json of all of
 * ionic's components. The output directory and manifest.json file
 * will be used by other tooling to bundle components together.
 *
 * This is simply the build script which runs the "compiler", this script
 * itself does not do the dirty work of creating these components, it's
 * just the task runner.
 */

import { CompilerConfig } from 'compiler';
import * as nodeSass from 'node-sass';
import * as path from 'path';

// dynamic require cuz this file gets transpiled to dist/
const compiler = require(path.join(__dirname, '../compiler'));


const config: CompilerConfig = {
  compilerOptions: {
    outDir: path.join(__dirname, '../ionic-components'),
    module: 'commonjs',
    target: 'es5'
  },
  include: [path.join(__dirname, '../../src')],
  exclude: ['node_modules', 'test'],
  debug: true,
  bundles: [
    ['ion-badge']
  ],
  packages: {
    nodeSass: nodeSass
  }
};


compiler.compile(config).then(results => {

  if (results.errors) {
    results.errors.forEach(err => {
      console.log(err);
    });
  }

});
