import { BuildConfig, Manifest } from '../util/interfaces';
import { BuildContext, BuildResults, BundlerConfig } from './interfaces';
import { bundle } from './bundle';
import { compile } from './compile';
import { generateDependentManifests, mergeManifests, updateManifestUrls } from './manifest';
import { generateProjectFiles } from './build-project';
import { updateDirectories, writeFiles } from './util';


export function build(buildConfig: BuildConfig) {
  normalizeBuildConfig(buildConfig);

  const sys = buildConfig.sys;
  const logger = buildConfig.logger;

  const timeSpan = logger.createTimeSpan(`build, ${buildConfig.devMode ? 'dev' : 'prod'} mode, started`);

  const buildResults: BuildResults = {
    diagnostics: [],
    manifest: {},
    componentRegistry: []
  };

  const ctx: BuildContext = {
    moduleFiles: {},
    filesToWrite: {}
  };

  return Promise.resolve().then(() => {
    // generate manifest phase
    return generateDependentManifests(buildConfig);

  }).then(dependentManifests => {
    // compile phase
    return compile(buildConfig, ctx).then(compileResults => {
      if (compileResults.diagnostics) {
        buildResults.diagnostics = buildResults.diagnostics.concat(compileResults.diagnostics);
      }

      const resultsManifest: Manifest = compileResults.manifest || {};

      const localManifest = updateManifestUrls(
        buildConfig,
        resultsManifest,
        buildConfig.collectionDest
      );
      return mergeManifests([].concat((localManifest || []), dependentManifests));
    });

  }).then(manifest => {
    // bundle phase
    const bundlerConfig: BundlerConfig = {
      manifest: manifest
    };

    return bundle(buildConfig, ctx, bundlerConfig).then(bundleResults => {
      if (bundleResults.diagnostics) {
        buildResults.diagnostics = buildResults.diagnostics.concat(bundleResults.diagnostics);
      }

      // generate the loader and core files for this project
      return generateProjectFiles(buildConfig, ctx, bundleResults.componentRegistry);
    });

  }).then(() => {
    // write all the files in one go
    const filesToWrite = Object.assign({}, ctx.filesToWrite);
    ctx.filesToWrite = {};

    if (buildConfig.devMode) {
      // dev mode
      // only ensure the directories it needs exists and writes the files
      return writeFiles(sys, buildConfig.rootDir, filesToWrite, buildConfig.dest);
    }

    // prod mode
    // first removes any directories and files that aren't in the files to write
    // then ensure the directories it needs exists and writes the files
    return updateDirectories(sys, buildConfig.rootDir, filesToWrite, buildConfig.dest);

  }).catch(err => {
    buildResults.diagnostics.push({
      msg: err.toString(),
      type: 'error',
      stack: err.stack
    });

  }).then(() => {
    buildResults.diagnostics.forEach(d => {
      if (d.type === 'error' && logger.level === 'debug' && d.stack) {
        logger.error(d.stack);
      } else {
        logger[d.type](d.msg);
      }
    });

    if (buildConfig.watch) {
      timeSpan.finish(`build ready, watching files...`);

    } else {
      timeSpan.finish(`build finished`);
    }

    return buildResults;
  });
}


export function normalizeBuildConfig(buildConfig: BuildConfig) {
  if (!buildConfig) {
    throw new Error(`invalid build config`);
  }
  if (!buildConfig.rootDir) {
    throw new Error('config.rootDir required');
  }
  if (!buildConfig.logger) {
    throw new Error(`config.logger required`);
  }
  if (!buildConfig.sys) {
    throw new Error('config.sys required');
  }

  if (typeof buildConfig.namespace !== 'string') {
    buildConfig.namespace = DEFAULT_NAMESPACE;
  }

  if (typeof buildConfig.src !== 'string') {
    buildConfig.src = DEFAULT_SRC_DIR;
  }
  if (!buildConfig.sys.path.isAbsolute(buildConfig.src)) {
    buildConfig.src = buildConfig.sys.path.join(buildConfig.rootDir, buildConfig.src);
  }

  if (typeof buildConfig.dest !== 'string') {
    buildConfig.dest = DEFAULT_DEST_DIR;
  }
  if (!buildConfig.sys.path.isAbsolute(buildConfig.dest)) {
    buildConfig.dest = buildConfig.sys.path.join(buildConfig.rootDir, buildConfig.dest);
  }

  if (typeof buildConfig.collectionDest !== 'string') {
    buildConfig.collectionDest = DEFAULT_COLLECTION_DIR;
  }
  if (!buildConfig.sys.path.isAbsolute(buildConfig.collectionDest)) {
    buildConfig.collectionDest = buildConfig.sys.path.join(buildConfig.rootDir, buildConfig.collectionDest);
  }

  buildConfig.devMode = !!buildConfig.devMode;
  buildConfig.watch = !!buildConfig.watch;
  buildConfig.generateCollection = !!buildConfig.generateCollection;
  buildConfig.collections = buildConfig.collections || [];
  buildConfig.bundles = buildConfig.bundles || [];
  buildConfig.exclude = buildConfig.exclude || [
    'node_modules',
    'bower_components'
  ];

  return buildConfig;
}


const DEFAULT_NAMESPACE = 'App';
const DEFAULT_SRC_DIR = 'src';
const DEFAULT_DEST_DIR = 'dist';
const DEFAULT_COLLECTION_DIR = 'collection';
