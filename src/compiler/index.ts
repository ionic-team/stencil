import { BuildError } from './logger';
import { bundleComponents } from './bundle-components';
import { CompilerOptions, CompilerContext } from './interfaces';
import { compileComponents } from './compile-components';
import * as path from 'path';


export function compile(opts: CompilerOptions, ctx: CompilerContext = {}) {
  validateDir(opts.srcDir, 'srcDir');
  validateDir(opts.destDir, 'destDir');
  validateDir(opts.ionicBundlesDir, 'ionicBundlesDir');
  validateDir(opts.ionicThemesDir, 'ionicThemesDir');

  return compileComponents(opts, ctx).then(() => {
    return bundleComponents(opts, ctx);
  });
}


function validateDir(dir: string, name: string) {
  if (!dir) {
    throw new BuildError(`${name} required`);

  } else if (!path.isAbsolute(dir)) {
    throw new BuildError(`${name} must be an absolute path`);
  }
}
