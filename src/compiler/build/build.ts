import { BuildConfig, Manifest } from '../../util/interfaces';
import { BuildContext, BuildResults, LoggerTimeSpan } from '../interfaces';
import { bundle } from '../bundle/bundle';
import { catchError, emptyDir, writeFiles } from '../util';
import { cleanDiagnostics } from '../logger/logger-util';
import { compileSrcDir } from './compile';
import { generateProjectFiles } from './build-project-files';
import { generateHtmlDiagnostics } from '../logger/generate-html-diagnostics';
import { loadDependentManifests, mergeManifests } from './manifest';
import { optimizeIndexHtml } from './optimize-html';
import { setupWatcher } from './watch';
import { validateBuildConfig } from '../validation';


export function build(config: BuildConfig, ctx?: BuildContext) {
  // create a timespan of the build process
  let timeSpan: LoggerTimeSpan;

  // create the build results which will be the returned object
  const buildResults: BuildResults = {
    diagnostics: [],
    files: [],
    componentRegistry: [],
  };

  // create the build context if it doesn't exist
  ctx = ctx || {};
  ctx.filesToWrite = ctx.filesToWrite || {};
  ctx.projectFiles = ctx.projectFiles || {};
  ctx.moduleFiles = ctx.moduleFiles || {};
  ctx.moduleBundleOutputs = ctx.moduleBundleOutputs || {};
  ctx.styleSassOutputs = ctx.styleSassOutputs || {};
  ctx.changedFiles = ctx.changedFiles || [];

  // reset counts
  ctx.sassBuildCount = 0;
  ctx.transpileBuildCount = 0;
  ctx.indexBuildCount = 0;
  ctx.moduleBundleCount = 0;
  ctx.styleBundleCount = 0;


  // begin the build
  return Promise.resolve().then(() => {
    // validate the build config
    if (!ctx.isRebuild) {
      validateBuildConfig(config);
    }

    timeSpan = config.logger.createTimeSpan(`${ctx.isRebuild ? 'rebuild' : 'build'}, ${config.devMode ? 'dev' : 'prod'} mode, started`);

  }).then(() => {
    // generate manifest phase
    return loadDependentManifests(config);

  }).then(dependentManifests => {
    // compile src directory phase
    return compileSrcPhase(config, ctx, dependentManifests, buildResults);

  }).then(manifest => {
    // bundle phase
    return bundlePhase(config, ctx, manifest, buildResults);

  }).then(() => {
    // optimize index.html
    return optimizeHtmlPhase(config, ctx, buildResults);

  }).then(() => {
    // write all the files in one go
    return writePhase(config, ctx, buildResults);

  }).then(() => {
    // setup watcher if need be
    return setupWatcher(config, ctx);

  }).catch(err => {
    // catch all phase
    catchError(buildResults.diagnostics, err);

  }).then(() => {
    // finalize phase
    if (config) {
      buildResults.diagnostics = cleanDiagnostics(buildResults.diagnostics);
      config.logger.printDiagnostics(buildResults.diagnostics);
      generateHtmlDiagnostics(config, buildResults.diagnostics);
    }

    if (timeSpan) {
      let buildText = ctx.isRebuild ? 'rebuild' : 'build';
      let buildStatus = 'finished';
      let watchText = config.watch ? ', watching for changes...' : '';
      let statusColor = 'green';
      if (buildResults.diagnostics.some(d => d.level === 'error')) {
        buildStatus = 'failed';
        statusColor = 'red';
      }

      timeSpan.finish(`${buildText} ${buildStatus}${watchText}`, statusColor, true, true);
    }

    if (typeof ctx.onFinish === 'function') {
      ctx.onFinish(buildResults);
      delete ctx.onFinish;
    }

    ctx.lastBuildHadError = (buildResults.diagnostics.some(d => d.level === 'error'));

    return buildResults;
  });
}


function compileSrcPhase(config: BuildConfig, ctx: BuildContext, dependentManifests: Manifest[], buildResults: BuildResults) {
  return compileSrcDir(config, ctx).then(compileResults => {
    if (compileResults.diagnostics) {
      buildResults.diagnostics = buildResults.diagnostics.concat(compileResults.diagnostics);
    }

    // get the manifest created from this project's code
    const projectManifest = compileResults.manifest || {};
    projectManifest.bundles = config.bundles || [];

    // merge this project's manifest with all of the dependent manifests
    // to have one manifest to rule them all
    const allManifests = [projectManifest].concat(dependentManifests || []);

    // merge their data together
    return mergeManifests(allManifests);
  });
}


function bundlePhase(config: BuildConfig, ctx: BuildContext, manifest: Manifest, buildResults: BuildResults) {
  return bundle(config, ctx, manifest).then(bundleResults => {
    if (bundleResults.diagnostics) {
      buildResults.diagnostics = buildResults.diagnostics.concat(bundleResults.diagnostics);
    }

    buildResults.componentRegistry = bundleResults.componentRegistry;

    // generate the loader and core files for this project
    return generateProjectFiles(config, ctx, bundleResults.componentRegistry);
  });
}


function optimizeHtmlPhase(config: BuildConfig, ctx: BuildContext, buildResults: BuildResults) {
  return optimizeIndexHtml(config, ctx).then(optimizeHtmlResults => {
    if (optimizeHtmlResults.diagnostics) {
      buildResults.diagnostics = buildResults.diagnostics.concat(optimizeHtmlResults.diagnostics);
    }
  });
}


function writePhase(config: BuildConfig, ctx: BuildContext, buildResults: BuildResults) {
  buildResults.files = Object.keys(ctx.filesToWrite).sort();
  const totalFilesToWrite = buildResults.files.length;

  const timeSpan = config.logger.createTimeSpan(`writePhase started, fileUpdates: ${totalFilesToWrite}`, true);

  // create a copy of all the files to write
  const filesToWrite = Object.assign({}, ctx.filesToWrite);

  // clear out the files to write object for the next build
  ctx.filesToWrite = {};

  return emptyDestDir(config, ctx).then(() => {
    if (totalFilesToWrite > 0) {
      // only write...when there's files to write
      return writeFiles(config.sys, config.rootDir, filesToWrite);
    }

    // no files to write
    return Promise.resolve();

  }).then(() => {
    timeSpan.finish(`writePhase finished`);
  });
}


function emptyDestDir(config: BuildConfig, ctx: BuildContext) {
  if (ctx.isRebuild) {
    // don't bother emptying the build directory when
    // it's a rebuild
    return Promise.resolve([]);
  }

  config.logger.debug(`empty dir: ${config.buildDest}`);
  config.logger.debug(`empty dir: ${config.collectionDest}`);

  // let's empty out the build dest directory
  return Promise.all([
    emptyDir(config.sys, config.buildDest),
    emptyDir(config.sys, config.collectionDest)
  ]);
}
