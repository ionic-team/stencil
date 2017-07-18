import { BuildConfig, Manifest } from '../../util/interfaces';
import { BuildContext, BuildResults, LoggerTimeSpan } from '../interfaces';
import { bundle } from '../bundle/bundle';
import { catchError, emptyDir, getBuildContext, resetBuildContextCounts, writeFiles } from '../util';
import { cleanDiagnostics } from '../../util/logger/logger-util';
import { compileSrcDir } from './compile';
import { copyAssets } from '../component-plugins/assets-plugin';
import { generateProjectFiles } from './build-project-files';
import { generateHtmlDiagnostics } from '../../util/logger/generate-html-diagnostics';
import { loadDependentManifests, mergeManifests } from './manifest';
import { optimizeIndexHtml } from './optimize-index-html';
import { setupWatcher } from './watch';
import { validateBuildConfig } from './validation';


export function build(config: BuildConfig, ctx?: BuildContext) {
  // create a timespan of the build process
  let timeSpan: LoggerTimeSpan;

  // create the build results which will be the returned object
  const buildResults: BuildResults = {
    diagnostics: [],
    files: [],
    componentRegistry: [],
    manifest: {}
  };

  // create the build context if it doesn't exist
  ctx = getBuildContext(ctx);

  // reset counts
  resetBuildContextCounts(ctx);

  // begin the build
  return Promise.resolve().then(() => {
    // validate the build config
    validateBuildConfig(config);

    timeSpan = config.logger.createTimeSpan(`${ctx.isRebuild ? 'rebuild' : 'build'}, ${config.devMode ? 'dev' : 'prod'} mode, started`);

  }).then(() => {
    // generate manifest phase
    return loadDependentManifests(config);

  }).then(dependentManifests => {
    // compile src directory phase
    return compileSrcPhase(config, ctx, dependentManifests, buildResults);

  }).then(manifest => {
    buildResults.manifest = manifest;

    // bundle phase
    return bundlePhase(config, ctx, manifest, buildResults);

  }).then(() => {
    // copy over asset files and
    // write all the files in one go
    return writePhase(config, ctx, buildResults.manifest, buildResults);

  }).then(() => {
    // optimize index.html
    return optimizeHtmlPhase(config, ctx, buildResults);

  }).then(() => {
    // setup watcher if need be
    return setupWatcher(config, ctx);

  }).catch(err => {
    // catch all phase
    catchError(buildResults.diagnostics, err);

  }).then(() => {
    // finalize phase
    if (config) {
      // check for config cuz it could have been undefined
      buildResults.diagnostics = cleanDiagnostics(buildResults.diagnostics);
      config.logger.printDiagnostics(buildResults.diagnostics);
      generateHtmlDiagnostics(config, buildResults.diagnostics);
    }

    if (timeSpan) {
      // create a nice pretty message stating what happend
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
      // fire off any provided onFinish fn every time the build finishes
      ctx.onFinish(buildResults);
    }

    // remember if the last build had an error or not
    // this is useful if the next build should do a full build or not
    ctx.lastBuildHadError = (buildResults.diagnostics.some(d => d.level === 'error'));

    // return what we've learned today
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
  if (buildResults.diagnostics.some(d => d.level === 'error')) {
    // don't bother if there's already a build error
    return Promise.resolve();
  }

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
  if (buildResults.diagnostics.some(d => d.level === 'error')) {
    // don't bother if there's already a build error
    return Promise.resolve();
  }

  return optimizeIndexHtml(config, ctx).then(optimizeHtmlResults => {
    if (optimizeHtmlResults.diagnostics) {
      buildResults.diagnostics = buildResults.diagnostics.concat(optimizeHtmlResults.diagnostics);
    }
  });
}


function writePhase(config: BuildConfig, ctx: BuildContext, manifest: Manifest, buildResults: BuildResults) {
  if (buildResults.diagnostics.some(d => d.level === 'error')) {
    // don't bother if there's already a build error
    // also clear out the filesToWrite for the next build
    ctx.filesToWrite = {};
    return Promise.resolve();
  }

  buildResults.files = Object.keys(ctx.filesToWrite).sort();
  const totalFilesToWrite = buildResults.files.length;

  const timeSpan = config.logger.createTimeSpan(`writePhase started, fileUpdates: ${totalFilesToWrite}`, true);

  // create a copy of all the files to write
  const filesToWrite = Object.assign({}, ctx.filesToWrite);

  // clear out the files to write object for the next build
  ctx.filesToWrite = {};

  return emptyDestDir(config, ctx).then(() => {
    // kick off writing files and copying assets
    return Promise.all([
      writeFiles(config.sys, config.rootDir, filesToWrite),
      copyAssets(config, manifest)
    ]);

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

  config.logger.debug(`empty dir: ${config.buildDir}`);
  config.logger.debug(`empty dir: ${config.collectionDir}`);

  // let's empty out the build dest directory
  return Promise.all([
    emptyDir(config.sys, config.buildDir),
    emptyDir(config.sys, config.collectionDir)
  ]);
}
