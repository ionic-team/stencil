import { BuildConfig, BuildResults } from '../../util/interfaces';
import { bundle } from '../bundle/bundle';
import { catchError, getBuildContext, hasError, resetBuildContext } from '../util';
import { cleanDiagnostics } from '../../util/logger/logger-util';
import { compileSrcDir } from '../build/compile';
import { generateAppFiles } from '../app/generate-app-files';
import { generateAppManifest } from '../manifest/generate-manifest';
import { isConfigValid } from '../build/build';
import { prerenderApp } from './prerender-app';
import { writeBuildFiles } from '../build/write-build';


export function prerender(config: BuildConfig) {
  // create the build context
  // ctx is where stuff is cached for fast in-memory lookups later
  const ctx = getBuildContext();

  // reset the build context
  resetBuildContext(ctx);

  // create the build results that get returned
  const buildResults: BuildResults = {
    files: [],
    diagnostics: [],
    manifest: {}
  };

  // validate the build config
  if (!isConfigValid(config, buildResults.diagnostics)) {
    // invalid build config, let's not continue
    return Promise.resolve(buildResults);
  }

  // keep track of how long the entire build process takes
  const timeSpan = config.logger.createTimeSpan(`prerender, ${config.devMode ? 'dev' : 'prod'} mode, started`);

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
    // copy over the entire www dir
    return copyWWW(config);

  }).then(() => {
    // prerender that app
    return prerenderApp(config, ctx);

  }).then(() => {
    // write all the files and copy asset files
    return writeBuildFiles(config, ctx, buildResults);

  }).catch(err => {
    // catch all phase
    catchError(ctx.diagnostics, err);

  }).then(() => {
    // finalize phase
    buildResults.diagnostics = cleanDiagnostics(ctx.diagnostics);
    config.logger.printDiagnostics(buildResults.diagnostics);

    config.logger.info(`prerendered urls:`, ctx.prerenderedUrls);

    // create a nice pretty message stating what happend
    let buildStatus = 'finished';
    let statusColor = 'green';

    if (hasError(ctx.diagnostics)) {
      buildStatus = 'failed';
      statusColor = 'red';
    }

    timeSpan.finish(`prerender ${buildStatus}`, statusColor, true, true);

    if (typeof ctx.onFinish === 'function') {
      // fire off any provided onFinish fn every time the build finishes
      ctx.onFinish(buildResults);
    }

    // remember if the last build had an error or not
    // this is useful if the next build should do a full build or not
    ctx.lastBuildHadError = hasError(ctx.diagnostics);

    if (ctx.localPrerenderServer) {
      ctx.localPrerenderServer.close();
      delete ctx.localPrerenderServer;
    }

    // return what we've learned today
    return buildResults;
  });
}


function copyWWW(config: BuildConfig) {
  const prerenderDir = config.prerender.prerenderDir;
  const wwwDir = config.wwwDir;

  return config.sys.emptyDir(prerenderDir).then(() => {
    return config.sys.copy(wwwDir, prerenderDir);
  });
}
