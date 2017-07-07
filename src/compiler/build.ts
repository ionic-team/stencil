import { BuildConfig, Manifest } from '../util/interfaces';
import { BuildContext, BuildResults, BundlerConfig } from './interfaces';
import { bundle } from './bundle';
import { compile } from './compile';
import { emptyDir, writeFiles } from './util';
import { generateDependentManifests, mergeManifests, updateManifestUrls } from './manifest';
import { generateProjectFiles } from './build-project-files';
import { optimizeHtml } from './optimize-html';
import { validateBuildConfig } from './validation';


export function build(buildConfig: BuildConfig) {
  validateBuildConfig(buildConfig);

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
    // optimize index.html
    return optimizeHtml(buildConfig, ctx).then(optimizeHtmlResults => {
      if (optimizeHtmlResults.diagnostics) {
        buildResults.diagnostics = buildResults.diagnostics.concat(optimizeHtmlResults.diagnostics);
      }
    });

  }).then(() => {
    // write all the files in one go
    return writeProjectFiles(buildConfig, ctx);

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


function writeProjectFiles(buildConfig: BuildConfig, ctx: BuildContext) {
  const filesToWrite = Object.assign({}, ctx.filesToWrite);
  ctx.filesToWrite = {};

  if (buildConfig.devMode) {
    // dev mode
    // only ensure the directories it needs exists and writes the files
    return writeFiles(buildConfig.sys, buildConfig.rootDir, filesToWrite);
  }

  // prod mode
  // first removes any empties out the directories we'll be writing to
  // then ensures the directories it needs exists and writes the files
  return Promise.all([
    emptyDir(buildConfig.sys, buildConfig.collectionDest),
    emptyDir(buildConfig.sys, buildConfig.buildDest)
  ]).then(() => {
    return writeFiles(buildConfig.sys, buildConfig.rootDir, filesToWrite);
  });
}
