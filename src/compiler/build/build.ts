import { BuildConfig, BuildContext, BuildResults, Diagnostic } from '../../util/interfaces';
import { bundle } from '../bundle/bundle';
import { catchError, getBuildContext, hasError, resetBuildContext } from '../util';
import { cleanDiagnostics } from '../../util/logger/logger-util';
import { compileSrcDir } from './compile';
import { copyTasks } from './copy-tasks';
import { emptyDestDir, writeBuildFiles } from './write-build';
import { generateAppFiles } from '../app/generate-app-files';
import { generateAppManifest } from '../manifest/generate-manifest';
import { generateBundles } from '../bundle/generate-bundles';
import { generateHtmlDiagnostics } from '../../util/logger/generate-html-diagnostics';
import { generateIndexHtml } from '../html/generate-index-html';
import { generateReadmes } from '../docs/generate-readmes';
import { generateServiceWorker } from '../service-worker/generate-sw';
import { initIndexHtml } from '../html/init-index-html';
import { prerenderApp } from '../prerender/prerender-app';
import { setupWatcher } from './watch';
import { validateBuildConfig } from '../../util/validate-config';
import { validatePrerenderConfig } from '../prerender/validate-prerender-config';
import { validateServiceWorkerConfig } from '../service-worker/validate-sw-config';


export async function build(config: BuildConfig, context?: any) {
  // create the build context if it doesn't exist
  // the buid context is the same object used for all builds and rebuilds
  // ctx is where stuff is cached for fast in-memory lookups later
  const ctx = getBuildContext(context);

  if (!ctx.isRebuild) {
    config.logger.info(config.logger.cyan(`${config.sys.compiler.name} v${config.sys.compiler.version}`));
  }

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
  if (!isConfigValid(config, ctx, buildResults.diagnostics)) {
    // invalid build config, let's not continue
    config.logger.printDiagnostics(buildResults.diagnostics);
    generateHtmlDiagnostics(config, buildResults.diagnostics);
    return buildResults;
  }

  // create an initial index.html file if one doesn't already exist
  // this is synchronous on purpose
  if (!initIndexHtml(config, ctx, buildResults.diagnostics)) {
    // error initializing the index.html file
    // something's wrong, so let's not continue
    config.logger.printDiagnostics(buildResults.diagnostics);
    generateHtmlDiagnostics(config, buildResults.diagnostics);
    return buildResults;
  }

  // keep track of how long the entire build process takes
  const timeSpan = config.logger.createTimeSpan(`${ctx.isRebuild ? 'rebuild' : 'build'}, ${config.fsNamespace}, ${config.devMode ? 'dev' : 'prod'} mode, started`);

  try {
    // begin the build
    // async scan the src directory for ts files
    // then transpile them all in one go
    const compileResults = await compileSrcDir(config, ctx);

    // generation the app manifest from the compiled results
    // and from all the dependent collections
    await generateAppManifest(config, ctx, compileResults.moduleFiles);

    // bundle modules and styles into separate files phase
    const manifestBundles = await bundle(config, ctx);

    // both styles and modules are done bundling
    // inject the styles into the modules and
    // generate each of the output bundles
    const cmpRegistry = generateBundles(config, ctx, manifestBundles);

    // generate the app files, such as app.js, app.core.js
    await generateAppFiles(config, ctx, manifestBundles, cmpRegistry);

    // empty the build dest directory
    // doing this now incase the
    // copy tasks add to the dest directories
    await emptyDestDir(config, ctx);

    // copy all assets
    if (!ctx.isRebuild) {
      // only do the initial copy on the first build
      await copyTasks(config, ctx);
    }

    // build index file and service worker
    await generateIndexHtml(config, ctx);

    // generate each of the readmes
    await generateReadmes(config, ctx);

    // write all the files and copy asset files
    await writeBuildFiles(config, ctx, buildResults);

    // generate the service worker
    await generateServiceWorker(config, ctx);

    // prerender that app
    await prerenderApp(config, ctx, manifestBundles);

    // setup watcher if need be
    await setupWatcher(config, ctx);

  } catch (e) {
    // catch all
    catchError(ctx.diagnostics, e);
  }

  // finalize phase
  buildResults.diagnostics = cleanDiagnostics(ctx.diagnostics);
  config.logger.printDiagnostics(buildResults.diagnostics);
  generateHtmlDiagnostics(config, buildResults.diagnostics);

  // create a nice pretty message stating what happend
  const buildText = ctx.isRebuild ? 'rebuild' : 'build';
  const watchText = config.watch ? ', watching for changes...' : '';
  let buildStatus = 'finished';
  let statusColor = 'green';

  if (hasError(ctx.diagnostics)) {
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
  ctx.lastBuildHadError = hasError(ctx.diagnostics);

  // return what we've learned today
  return buildResults;
}


export function isConfigValid(config: BuildConfig, ctx: BuildContext, diagnostics: Diagnostic[]) {
  try {
    // validate the build config
    validateBuildConfig(config, true);

    if (!ctx.isRebuild) {
      validatePrerenderConfig(config);
      validateServiceWorkerConfig(config);
    }

  } catch (e) {
    if (config.logger) {
      catchError(diagnostics, e);
    } else {
      console.error(e);
    }
    return false;
  }

  return true;
}
