import { build } from './build';
import { collection } from './collection';
import { BuildConfig, TaskOptions } from './interfaces';


export function run(task: string, opts: TaskOptions) {
  const rootDir = opts.rootDir;
  const sys = opts.sys;
  const stencilConfig = opts.stencilConfig;

  const compiledDir = sys.path.join(rootDir, 'tmp');

  const namespace = stencilConfig.namespace;
  const srcDir = sys.path.join(rootDir, stencilConfig.src ? stencilConfig.src : 'src');
  const destDir = sys.path.join(rootDir, stencilConfig.dest ? stencilConfig.dest : 'dist');
  const bundles = stencilConfig.bundles;
  const collections = stencilConfig.collections;
  const preamble = stencilConfig.preamble;

  switch (task) {
    case 'build':

      const buildConfig: BuildConfig = {
        sys: sys,
        logger: opts.logger,
        isDevMode: opts.isDevMode,
        isWatch: opts.isWatch,
        preamble,
        rootDir: rootDir,
        compiledDir,
        namespace,
        srcDir,
        destDir,
        bundles,
        collections
      };

      build(buildConfig);
      break;

    case 'collection':
      const collectionConfig: BuildConfig = {
        sys: sys,
        logger: opts.logger,
        isDevMode: opts.isDevMode,
        isWatch: opts.isWatch,
        preamble,
        rootDir: rootDir,
        compiledDir,
        namespace,
        srcDir,
        destDir,
        bundles,
        collections
      };

      collection(collectionConfig);
      break;

    default:
      throw 'Command expected for stencil';
  }
}
