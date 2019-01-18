import * as d from '@declarations';
import { runJest } from './jest-runner';
import { logger, sys } from '@sys';


export async function runJestScreenshot(config: d.Config, env: d.E2EProcessEnv) {
  logger.debug(`screenshot connector: ${config.testing.screenshotConnector}`);

  const ScreenshotConnector = require(config.testing.screenshotConnector) as any;
  const connector: d.ScreenshotConnector = new ScreenshotConnector();

  // for CI, let's wait a little longer than locally before taking the screenshot
  const timeoutBeforeScreenshot = config.flags.ci ? 30 : 10;

  const pixelmatchModulePath = sys.path.join(sys.compiler.packageDir, 'screenshot', 'pixel-match.js');
  logger.debug(`pixelmatch module: ${pixelmatchModulePath}`);

  const initTimespan = logger.createTimeSpan(`screenshot, initBuild started`, true);
  await connector.initBuild({
    buildId: createBuildId(),
    buildMessage: createBuildMessage(),
    buildTimestamp: Date.now(),
    appNamespace: config.namespace,
    rootDir: config.rootDir,
    cacheDir: config.cacheDir,
    packageDir: sys.compiler.packageDir,
    updateMaster: config.flags.updateScreenshot,
    logger: logger,
    allowableMismatchedPixels: config.testing.allowableMismatchedPixels,
    allowableMismatchedRatio: config.testing.allowableMismatchedRatio,
    pixelmatchThreshold: config.testing.pixelmatchThreshold,
    timeoutBeforeScreenshot: timeoutBeforeScreenshot,
    pixelmatchModulePath: pixelmatchModulePath
  });

  if (!config.flags.updateScreenshot) {
    await connector.pullMasterBuild();
  }

  initTimespan.finish(`screenshot, initBuild finished`);

  const dataPromises = await Promise.all([
    await connector.getMasterBuild(),
    await connector.getScreenshotCache()
  ]);

  const masterBuild = dataPromises[0];
  const screenshotCache = dataPromises[1];

  env.__STENCIL_SCREENSHOT_BUILD__ = connector.toJson(masterBuild, screenshotCache);

  const testsTimespan = logger.createTimeSpan(`screenshot, tests started`, true);

  const passed = await runJest(config, env);

  testsTimespan.finish(`screenshot, tests finished, passed: ${passed}`);

  try {
    const completeTimespan = logger.createTimeSpan(`screenshot, completeTimespan started`, true);
    let results = await connector.completeBuild(masterBuild);
    completeTimespan.finish(`screenshot, completeTimespan finished`);

    if (results) {
      const publishTimespan = logger.createTimeSpan(`screenshot, publishBuild started`, true);
      results = await connector.publishBuild(results);
      publishTimespan.finish(`screenshot, publishBuild finished`);

      if (config.flags.updateScreenshot) {
        // updating the master screenshot
        if (results.currentBuild && typeof results.currentBuild.previewUrl === 'string') {
          logger.info(logger.magenta(results.currentBuild.previewUrl));
        }

      } else {
        // comparing the screenshot to master
        if (results.compare) {
          try {
            await connector.updateScreenshotCache(screenshotCache, results);
          } catch (e) {
            logger.error(e);
          }

          logger.info(`screenshots compared: ${results.compare.diffs.length}`);

          if (typeof results.compare.url === 'string') {
            logger.info(logger.magenta(results.compare.url));
          }
        }
      }
    }

  } catch (e) {
    logger.error(e, e.stack);
  }

  return passed;
}


function createBuildId() {
  const d = new Date();

  let fmDt = (d.getFullYear() + '');
  fmDt += ('0' + (d.getMonth() + 1)).slice(-2);
  fmDt += ('0' + d.getDate()).slice(-2);
  fmDt += ('0' + d.getHours()).slice(-2);
  fmDt += ('0' + d.getMinutes()).slice(-2);
  fmDt += ('0' + d.getSeconds()).slice(-2);

  return fmDt;
}


function createBuildMessage() {
  const d = new Date();

  let fmDt = (d.getFullYear() + '') + '-';
  fmDt += ('0' + (d.getMonth() + 1)).slice(-2) + '-';
  fmDt += ('0' + d.getDate()).slice(-2) + ' ';
  fmDt += ('0' + d.getHours()).slice(-2) + ':';
  fmDt += ('0' + d.getMinutes()).slice(-2) + ':';
  fmDt += ('0' + d.getSeconds()).slice(-2);

  return `Build: ${fmDt}`;
}
