import * as d from '../../declarations';
import { catchError } from '../util';
import { generateBuildResults } from './build-results';
import { generateBuildStats } from './build-stats';
import { initWatcher } from '../watcher/watcher-init';


export async function buildFinish(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, aborted: boolean) {
  if (buildCtx.hasFinished && buildCtx.buildResults) {
    return buildCtx.buildResults;
  }

  buildCtx.debug(`${aborted ? 'aborted' : 'finished'} build, ${buildCtx.timestamp}`);

  buildCtx.buildResults = await generateBuildResults(config, compilerCtx, buildCtx);

  // log any errors/warnings
  if (!buildCtx.hasFinished) {
    // haven't set this build as finished yet
    config.logger.printDiagnostics(buildCtx.buildResults.diagnostics);

    if (!buildCtx.isRebuild && config.devServer && config.devServer.browserUrl && config.flags.serve) {
      config.logger.info(`dev server: ${config.logger.cyan(config.devServer.browserUrl)}`);
    }

    if (buildCtx.isRebuild && buildCtx.buildResults.hmr && !aborted) {
      const hmr = buildCtx.buildResults.hmr;
      if (hmr.componentsUpdated) {
        const components = hmr.componentsUpdated.join(', ');
        config.logger.info(`updated components: ${config.logger.cyan(components)}`);
      }

      if (hmr.inlineStylesUpdated) {
        const inlineStyles = hmr.inlineStylesUpdated.map(s => s.styleTag).reduce((arr, v) => {
          if (!arr.includes(v)) {
            arr.push(v);
          }
          return arr;
        }, []).join(', ');
        config.logger.info(`updated styles: ${config.logger.cyan(inlineStyles)}`);
      }

      if (hmr.externalStylesUpdated) {
        const extStyles = hmr.externalStylesUpdated.join(', ');
        config.logger.info(`updated stylesheets: ${config.logger.cyan(extStyles)}`);
      }

      if (hmr.imagesUpdated) {
        const images = hmr.imagesUpdated.join(', ');
        config.logger.info(`updated images: ${config.logger.cyan(images)}`);
      }
    }

    // create a nice pretty message stating what happend
    const buildText = buildCtx.isRebuild ? 'rebuild' : 'build';
    const watchText = config.watch ? ', watching for changes...' : '';
    let buildStatus = 'finished';
    let statusColor = 'green';

    if (buildCtx.buildResults.hasError) {
      // gosh darn, build had errors :(
      compilerCtx.lastBuildHadError = true;
      buildStatus = 'failed';
      statusColor = 'red';

    } else {
      // successful build!
      compilerCtx.hasSuccessfulBuild = true;
      compilerCtx.lastBuildHadError = false;

      if (!buildCtx.isRebuild && config.watch) {
        // successful first time build and we're watching the files
        // so let's hash all of the source files content so we can
        // do great file change detection to know when files actually change
        compilerCtx.fs.setBuildHashes();
      }
    }

    if (!aborted) {
      // print out the time it took to build
      // and add the duration to the build results
      buildCtx.timeSpan.finish(`${buildText} ${buildStatus}${watchText}`, statusColor, true, true);

      // write the build stats
      await generateBuildStats(config, compilerCtx, buildCtx, buildCtx.buildResults);
    }

    // write all of our logs to disk if config'd to do so
    config.logger.writeLogs(buildCtx.isRebuild);

    if (!aborted) {
      // emit a buildFinish event for anyone who cares
      compilerCtx.events.emit('buildFinish', buildCtx.buildResults);
    }

    if (config.watch) {
      try {
        // setup watcher if need be
        initWatcher(config, compilerCtx, buildCtx);
      } catch (e) {
        catchError(buildCtx.diagnostics, e);
      }

    } else {
      config.sys.destroy();
    }
  }

  buildCtx.hasFinished = true;

  return buildCtx.buildResults;
}
