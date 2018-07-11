import * as d from '../../declarations';
import { generateBuildResults } from './build-results';
import { generateBuildStats } from './build-stats';
import { initFsWatch } from '../fs-watch/fs-watch-init';
import { writeCacheStats } from './cache-stats';


export async function buildFinish(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, aborted: boolean) {
  if (buildCtx.hasFinished && buildCtx.buildResults) {
    // we've already marked this build as finished and
    // already created the build results, just return these
    return buildCtx.buildResults;
  }

  buildCtx.debug(`${aborted ? 'aborted' : 'finished'} build, ${buildCtx.timestamp}`);

  // create the build results data
  buildCtx.buildResults = generateBuildResults(config, compilerCtx, buildCtx);

  // log any errors/warnings
  if (!buildCtx.hasFinished) {
    // haven't set this build as finished yet
    config.logger.printDiagnostics(buildCtx.buildResults.diagnostics);

    if (!compilerCtx.hasLoggedServerUrl && config.devServer && config.devServer.browserUrl && config.flags.serve) {
      // we've opened up the dev server
      // let's print out the dev server url
      config.logger.info(`dev server: ${config.logger.cyan(config.devServer.browserUrl)}`);
      compilerCtx.hasLoggedServerUrl = true;
    }

    if (buildCtx.isRebuild && buildCtx.buildResults.hmr && !aborted && buildCtx.isActiveBuild) {
      // this is a rebuild, and we've got hmr data
      // and this build hasn't been aborted
      logHmr(config, buildCtx);
    }

    // create a nice pretty message stating what happend
    const buildText = buildCtx.isRebuild ? 'rebuild' : 'build';
    const watchText = config.watch ? ', watching for changes...' : '';
    let buildStatus = 'finished';
    let statusColor = 'green';

    if (buildCtx.hasError) {
      // gosh darn, build had errors
      // ಥ_ಥ
      compilerCtx.lastBuildHadError = true;
      buildStatus = 'failed';
      statusColor = 'red';

    } else {
      // successful build!
      // ┏(°.°)┛ ┗(°.°)┓ ┗(°.°)┛ ┏(°.°)┓
      compilerCtx.hasSuccessfulBuild = true;
      compilerCtx.lastBuildHadError = false;
    }

    if (!aborted) {
      // print out the time it took to build
      // and add the duration to the build results
      buildCtx.timeSpan.finish(`${buildText} ${buildStatus}${watchText}`, statusColor, true, true);

      // write the build stats
      await generateBuildStats(config, compilerCtx, buildCtx, buildCtx.buildResults);

      // emit a buildFinish event for anyone who cares
      compilerCtx.events.emit('buildFinish', buildCtx.buildResults);
    }

    // write all of our logs to disk if config'd to do so
    // do this even if there are errors or not the active build
    config.logger.writeLogs(buildCtx.isRebuild);

    if (config.watch) {
      // this is a watch build
      // setup watch if we haven't done so already
      initFsWatch(config, compilerCtx, buildCtx);

    } else {
      // not a watch build, so lets destroy anything left open
      config.sys.destroy();
    }
  }

  // write cache stats only for memory debugging
  writeCacheStats(config, compilerCtx, buildCtx);

  // it's official, this build has finished
  buildCtx.hasFinished = true;

  if (buildCtx.isActiveBuild) {
    compilerCtx.isActivelyBuilding = false;
  }

  return buildCtx.buildResults;
}


function logHmr(config: d.Config, buildCtx: d.BuildCtx) {
  // this is a rebuild, and we've got hmr data
  // and this build hasn't been aborted
  const hmr = buildCtx.buildResults.hmr;
  if (hmr.componentsUpdated && hmr.componentsUpdated.length > 0) {
    const components = hmr.componentsUpdated.join(', ');
    config.logger.info(`updated components: ${config.logger.cyan(components)}`);
  }

  if (hmr.inlineStylesUpdated && hmr.inlineStylesUpdated.length > 0) {
    const inlineStyles = hmr.inlineStylesUpdated.map(s => s.styleTag).reduce((arr, v) => {
      if (!arr.includes(v)) {
        arr.push(v);
      }
      return arr;
    }, []).join(', ');
    config.logger.info(`updated styles: ${config.logger.cyan(inlineStyles)}`);
  }

  if (hmr.externalStylesUpdated && hmr.externalStylesUpdated.length > 0) {
    const extStyles = hmr.externalStylesUpdated.join(', ');
    config.logger.info(`updated stylesheets: ${config.logger.cyan(extStyles)}`);
  }

  if (hmr.imagesUpdated && hmr.imagesUpdated.length > 0) {
    const images = hmr.imagesUpdated.join(', ');
    config.logger.info(`updated images: ${config.logger.cyan(images)}`);
  }
}
