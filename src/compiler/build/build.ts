import { BuildConfig, BuildResults, Diagnostic } from '../../util/interfaces';
import { bundle } from '../bundle/bundle';
import { catchError, getBuildContext, resetBuildContext } from '../util';
import { cleanDiagnostics } from '../../util/logger/logger-util';
import { compileSrcDir } from './compile';
import { generateHtmlDiagnostics } from '../../util/logger/generate-html-diagnostics';
import { generateAppFiles } from '../app/generate-app-files';
import { generateAppManifest } from '../manifest/generate-manifest';
import { prerenderIndexHtml } from './prerender-index-html';
import { setupWatcher } from './watch';
import { validateBuildConfig } from './validation';
import { writeBuildFiles } from './write-build';


export function build(config: BuildConfig, context?: any) {
  // create the build context if it doesn't exist
  // the buid context is the same object used for all builds and rebuilds
  // ctx is where stuff is cached for fast in-memory lookups later
  const ctx = getBuildContext(context);

  // reset the build context, this is important for rebuilds
  resetBuildContext(ctx);

  // create the build results that get returned
  const buildResults: BuildResults = {
    files: [],
    diagnostics: [],
    manifest: {},
    changedFiles: ctx.isRebuild ? ctx.changedFiles : null
  };

  // validate the build config
  if (!isConfigValid(config, buildResults.diagnostics)) {
    return Promise.resolve(buildResults);
  }

  // keep track of how long the entire build process takes
  const timeSpan = config.logger.createTimeSpan(`${ctx.isRebuild ? 'rebuild' : 'build'}, ${config.devMode ? 'dev' : 'prod'} mode, started`);

  // begin the build
  return Promise.resolve().then(() => {
    // async scan the src directory for ts files
    // then transpile them all in one go
    return compileSrcDir(config, ctx);

  }).then(compileResults => {
    // generation the app manifest from the compiled results
    // and from all the dependent collections
    return generateAppManifest(config, ctx, compileResults.moduleFiles);

  }).then(() => {
    // bundle modules and styles into separate files phase
    return bundle(config, ctx);

  }).then(() => {
    // generate the app files, such as app.js, app.core.js
    return generateAppFiles(config, ctx);

  }).then(() => {
    // prerender index.html
    return prerenderIndexHtml(config, ctx);

  }).then(() => {
    // write all the files and copy asset files
    return writeBuildFiles(config, ctx, buildResults);

  }).then(() => {
    // setup watcher if need be
    return setupWatcher(config, ctx);

  }).catch(err => {
    // catch all phase
    catchError(ctx.diagnostics, err);

  }).then(() => {
    // finalize phase
    buildResults.diagnostics = cleanDiagnostics(ctx.diagnostics);
    config.logger.printDiagnostics(buildResults.diagnostics);
    generateHtmlDiagnostics(config, buildResults.diagnostics);

    // create a nice pretty message stating what happend
    let buildText = ctx.isRebuild ? 'rebuild' : 'build';
    let buildStatus = 'finished';
    let watchText = config.watch ? ', watching for changes...' : '';
    let statusColor = 'green';

    if (ctx.diagnostics.some(d => d.level === 'error')) {
      buildStatus = 'failed';
      statusColor = 'red';
    }

    timeSpan.finish(`${buildText} ${buildStatus}${watchText}`, statusColor, true, true);

    if (typeof ctx.onFinish === 'function') {
      // fire off any provided onFinish fn every time the build finishes
      ctx.onFinish(buildResults);
    }

    // remember if the last build had an error or not
    // this is useful if the next build should do a full build or not
    ctx.lastBuildHadError = (ctx.diagnostics.some(d => d.level === 'error'));

    // return what we've learned today
    return buildResults;
  });
}


function isConfigValid(config: BuildConfig, diagnostics: Diagnostic[]) {
  try {
    // validate the build config
    validateBuildConfig(config);

  } catch (e) {
    if (config.logger) {
      catchError(diagnostics, e);
      config.logger.printDiagnostics(diagnostics);
      generateHtmlDiagnostics(config, diagnostics);

    } else {
      console.error(e);
    }
    return false;
  }

  return true;
}
