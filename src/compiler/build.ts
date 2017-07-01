import { BuildConfig, Manifest } from '../util/interfaces';
import { BuildContext, BundlerConfig, CompilerConfig } from './interfaces';
import { bundle } from './bundle';
import { compile } from './compile';
import { generateDependentManifests, mergeManifests, updateManifestUrls } from './manifest';
import { generateProjectCore } from './build-project-core';
import { removeFilePath } from './util';


export function build(buildConfig: BuildConfig, ctx?: BuildContext) {
  // use the same build context object throughout the build
  ctx = ctx || {};

  buildConfig.logger.info(`build, ${buildConfig.isDevMode ? 'dev' : 'prod'} mode`);

  return Promise.resolve().then(() => {
    // validate our data is good to go
    validateBuildConfig(buildConfig);

    return generateDependentManifests(
      buildConfig.logger,
      buildConfig.sys,
      buildConfig.collections,
      buildConfig.rootDir,
      buildConfig.compiledDir);

  }).then(dependentManifests => {

    return compileProject(buildConfig, ctx).then(results => {
      if (results.errors && results.errors.length > 0) {
        results.errors.forEach(err => {
          buildConfig.logger.error(err);
        });
        throw 'build error';
      }

      const resultsManifest = results.manifest || {};

      const localManifest = updateManifestUrls(
        buildConfig.logger,
        buildConfig.sys,
        resultsManifest,
        buildConfig.compiledDir,
        buildConfig.compiledDir
      );
      return mergeManifests([].concat((localManifest || []), dependentManifests));

    });

  }).then(manifest => {
    // bundle all of the components into their separate files
    return bundleProject(buildConfig, ctx, manifest);

  }).then(bundleProjectResults => {
    // generate the core loader and aux files for this project
    return generateProjectCore(buildConfig, bundleProjectResults.componentRegistry);

  }).then(() => {
    // remove temp compiled dir
    // remove is async but no need to wait on it
    removeFilePath(buildConfig.sys, buildConfig.compiledDir);

    buildConfig.logger.info(`build, done`);

  }).catch(err => {
    buildConfig.logger.error(err);
    err.stack && buildConfig.logger.error(err.stack);
  });
}


function compileProject(buildConfig: BuildConfig, ctx: BuildContext) {
  const config: CompilerConfig = {
    compilerOptions: {
      outDir: buildConfig.compiledDir,
      module: 'commonjs',
      target: 'es5',
      rootDir: buildConfig.srcDir
    },
    include: [
      buildConfig.srcDir
    ],
    exclude: [
      'node_modules',
      'compiler',
      'test'
    ],
    isDevMode: buildConfig.isDevMode,
    logger: buildConfig.logger,
    bundles: buildConfig.bundles,
    isWatch: buildConfig.isWatch,
    sys: buildConfig.sys
  };

  return compile(config, ctx);
}


function bundleProject(buildConfig: BuildConfig, ctx: BuildContext, manifest: Manifest) {
  const config: BundlerConfig = {
    namespace: buildConfig.namespace,
    srcDir: buildConfig.compiledDir,
    destDir: buildConfig.destDir,
    manifest: manifest,
    sys: buildConfig.sys,
    devMode: buildConfig.isDevMode,
    isWatch: buildConfig.isWatch,
    logger: buildConfig.logger
  };

  return bundle(config, ctx);
}


function validateBuildConfig(buildConfig: BuildConfig) {
  if (!buildConfig.srcDir) {
    throw `config.srcDir required`;
  }
  if (!buildConfig.sys) {
    throw 'config.sys required';
  }
  if (!buildConfig.sys.fs) {
    throw 'config.sys.fs required';
  }
  if (!buildConfig.sys.path) {
    throw 'config.sys.path required';
  }
  if (!buildConfig.sys.sass) {
    throw 'config.sys.sass required';
  }
  if (!buildConfig.sys.rollup) {
    throw 'config.sys.rollup required';
  }
  if (!buildConfig.sys.typescript) {
    throw 'config.sys.typescript required';
  }

  // ensure we've at least got empty objects
  buildConfig.bundles = buildConfig.bundles || [];
  buildConfig.collections = buildConfig.collections || [];

  // default to "App" namespace if one wasn't provided
  buildConfig.namespace = (buildConfig.namespace || 'App').trim();

  // default to "bundles" directory if one wasn't provided
  buildConfig.namespace = (buildConfig.namespace || 'bundles').trim();
}
