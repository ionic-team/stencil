import { BuildConfig, Manifest } from '../util/interfaces';
import { BuildContext, BuildResults, BundlerConfig, LoggerTimeSpan } from './interfaces';
import { bundle } from './bundle';
import { compileSrcDir } from './compile';
import { emptyDir, writeFiles } from './util';
import { mergeManifests, updateManifestUrls } from './manifest';
import { generateProjectFiles } from './build-project-files';
import { optimizeHtml } from './optimize-html';
import { readFile } from './util';
import { resolveFrom } from './resolve-from';
import { setupWatcher } from './watch';
import { validateBuildConfig } from './validation';


export function build(buildConfig: BuildConfig, ctx?: BuildContext) {
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
  ctx.moduleFiles = ctx.moduleFiles || {};
  ctx.moduleBundleOutputs = ctx.moduleBundleOutputs || {};
  ctx.styleSassOutputs = ctx.styleSassOutputs || {};
  ctx.changedFiles = ctx.changedFiles || [];

  // reset counts
  ctx.sassBuildCount = 0;
  ctx.transpileBuildCount = 0;
  ctx.moduleBundleCount = 0;
  ctx.styleBundleCount = 0;


  // begin the build
  return Promise.resolve().then(() => {
    // validate the build config
    if (!ctx.isRebuild) {
      validateBuildConfig(buildConfig);
    }

    timeSpan = buildConfig.logger.createTimeSpan(`${ctx.isRebuild ? 'rebuild' : 'build'}, ${buildConfig.devMode ? 'dev' : 'prod'} mode, started`);

  }).then(() => {
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
    return writePhase(buildConfig, ctx, buildResults);

  }).then(() => {
    // setup watcher if need be
    return setupWatcher(buildConfig, ctx);

  }).catch(err => {
    // catch all phase
    return catchAll(buildResults, err);

  }).then(() => {
    // finalize phase
    if (buildConfig) {
      buildConfig.logger.debug(`transpileBuildCount: ${ctx.transpileBuildCount}`);
      buildConfig.logger.debug(`sassBuildCount: ${ctx.sassBuildCount}`);
      buildConfig.logger.debug(`moduleBundleCount: ${ctx.moduleBundleCount}`);
      buildConfig.logger.debug(`styleBundleCount: ${ctx.styleBundleCount}`);

      buildResults.diagnostics.forEach(d => {
        if (d.type === 'error' && buildConfig.logger.level === 'debug' && d.stack) {
          buildConfig.logger.error(d.stack);
        } else {
          buildConfig.logger[d.type](d.msg);
        }
      });
    }

    if (timeSpan) {
      let buildText = ctx.isRebuild ? 'rebuild' : 'build';
      let buildStatus = 'finished';
      let watchText = buildConfig.watch ? ', watching for changes...' : '';
      let statusColor = 'green';
      if (buildResults.diagnostics.some(d => d.type === 'error')) {
        buildStatus = 'failed';
        statusColor = 'red';
      }

      timeSpan.finish(`${buildText} ${buildStatus}${watchText}`, statusColor, true, true);
    }

    if (typeof ctx.onFinish === 'function') {
      ctx.onFinish(buildResults);
      delete ctx.onFinish;
    }

    return buildResults;
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

    buildResults.componentRegistry = bundleResults.componentRegistry;

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


export function writePhase(buildConfig: BuildConfig, ctx: BuildContext, buildResults: BuildResults) {
  buildResults.files = Object.keys(ctx.filesToWrite).sort();

  const timeSpan = buildConfig.logger.createTimeSpan(`writePhase started, fileUpdates: ${buildResults.files.length}`, true);

  // create a copy of all the files to write
  const filesToWrite = Object.assign({}, ctx.filesToWrite);

  // clear out the files to write for next time
  ctx.filesToWrite = {};

  const dirPromises: Promise<any>[] = [];
  if (buildResults.files.length > 0 && !buildConfig.devMode) {
    // only prod mode empties directories
    dirPromises.push(emptyDir(buildConfig.sys, buildConfig.collectionDest));
    dirPromises.push(emptyDir(buildConfig.sys, buildConfig.buildDest));
  }

  return Promise.all(dirPromises).then(() => {
    if (buildResults.files.length > 0) {
      return writeFiles(buildConfig.sys, buildConfig.rootDir, filesToWrite);
    }
    return Promise.resolve();

  }).then(() => {
    timeSpan.finish(`writePhase finished`);
  });
}
