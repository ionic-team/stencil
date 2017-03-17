import { CompilerOptions, CompilerContext } from './interfaces';
import * as fs from 'fs-extra'
import * as path from 'path';


export function bundleComponents(opts: CompilerOptions, ctx: CompilerContext) {
  return Promise.all([
    createIonicJs(opts, ctx),
    createComponentRegistry(opts, ctx),
    createES5ComponentRegistry(opts, ctx)
  ]);
}


export function createIonicJs(opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const fileName = 'ionic.js';

    const src = path.join(opts.ionicBundlesDir, fileName);
    const dest = path.join(opts.destDir, fileName);

    fs.copy(src, dest, err => {
      if (err) {
        console.log(err);
      }
      resolve();
    });
  });
}


function createComponentRegistry(opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const fileName = 'ionic.components.js';

    const src = path.join(opts.ionicBundlesDir, fileName);
    const dest = path.join(opts.destDir, fileName);

    fs.copy(src, dest, err => {
      if (err) {
        console.log(err);
      }
      resolve();
    });
  });
}


function createES5ComponentRegistry(opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const fileName = 'ionic.components.es5.js';

    const src = path.join(opts.ionicBundlesDir, fileName);
    const dest = path.join(opts.destDir, fileName);

    fs.copy(src, dest, err => {
      if (err) {
        console.log(err);
      }
      resolve();
    });
  });
}
