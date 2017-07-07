import { BuildConfig, Manifest } from '../util/interfaces';
import { BuildContext, BuildResults, BundlerConfig } from './interfaces';
import { bundle } from './bundle';
import { compileSrcDir } from './compile';
import { emptyDir, writeFiles } from './util';
import { mergeManifests, updateManifestUrls } from './manifest';
import { generateProjectFiles } from './build-project-files';
import { optimizeHtml } from './optimize-html';
import { readFile } from './util';
import { resolveFrom } from './resolve-from';
import { validateBuildConfig } from './validation';


export function build(buildConfig: BuildConfig) {
  // validate the build config
  validateBuildConfig(buildConfig);

  const logger = buildConfig.logger;

  // create a timespan of the build process
  const timeSpan = logger.createTimeSpan(`build, ${buildConfig.devMode ? 'dev' : 'prod'} mode, started`);

  // create the build results which will be the returned object
  const buildResults: BuildResults = {
    diagnostics: [],
    manifest: {},
    componentRegistry: []
  };

  // create the build context
  const ctx: BuildContext = {
    moduleFiles: {},
    filesToWrite: {}
  };

  // begin the build
  return Promise.resolve().then(() => {
    // generate manifest phase
    return manifestPhase(buildConfig);

  }).then(dependentManifests => {
    // compile src directory phase
    return compileSrcPhase(buildConfig, ctx, dependentManifests, buildResults);

  }).then(manifest => {
    // bundle phase
    return bundlePhase(buildConfig, ctx, manifest, buildResults);

  }).then(() => {
    // optimize index.html
    return optimizeHtmlPhase(buildConfig, ctx, buildResults);

  }).then(() => {
    // write all the files in one go
    return writePhase(buildConfig, ctx);

  }).catch(err => {
    // catch all phase
    return catchAll(buildResults, err);

  }).then(() => {
    // finalize phase
    if (buildConfig.watch) {
      timeSpan.finish(`rebuild ready, watching files...`);

    } else {
      timeSpan.finish(`build finished`);
    }

    return finalizePhase(buildConfig, buildResults);
  });
}


export function manifestPhase(buildConfig: BuildConfig) {
  const sys = buildConfig.sys;

  return Promise.all(buildConfig.collections.map(collection => {

    const manifestJsonFile = resolveFrom(sys, buildConfig.rootDir, collection);
    const manifestDir = sys.path.dirname(manifestJsonFile);

    return readFile(sys, manifestJsonFile).then(manifestJsonContent => {
      const manifest: Manifest = JSON.parse(manifestJsonContent);

      return updateManifestUrls(buildConfig, manifest, manifestDir);
    });

  }));
}


export function compileSrcPhase(buildConfig: BuildConfig, ctx: BuildContext, dependentManifests: Manifest[], buildResults: BuildResults) {
  return compileSrcDir(buildConfig, ctx).then(compileResults => {
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
}


export function bundlePhase(buildConfig: BuildConfig, ctx: BuildContext, manifest: Manifest, buildResults: BuildResults) {
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
}


export function optimizeHtmlPhase(buildConfig: BuildConfig, ctx: BuildContext, buildResults: BuildResults) {
  return optimizeHtml(buildConfig, ctx).then(optimizeHtmlResults => {
    if (optimizeHtmlResults.diagnostics) {
      buildResults.diagnostics = buildResults.diagnostics.concat(optimizeHtmlResults.diagnostics);
    }
  });
}


export function catchAll(buildResults: BuildResults, err: any) {
  buildResults.diagnostics.push({
    msg: err.toString(),
    type: 'error',
    stack: err.stack
  });
}


export function finalizePhase(buildConfig: BuildConfig, buildResults: BuildResults) {
  buildResults.diagnostics.forEach(d => {
    if (d.type === 'error' && buildConfig.logger.level === 'debug' && d.stack) {
      buildConfig.logger.error(d.stack);
    } else {
      buildConfig.logger[d.type](d.msg);
    }
  });

  return buildResults;
}


export function writePhase(buildConfig: BuildConfig, ctx: BuildContext) {
  // create a copy of all the files to write
  const filesToWrite = Object.assign({}, ctx.filesToWrite);

  // clear out the files to write for next time
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
