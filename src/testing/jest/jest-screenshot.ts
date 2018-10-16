import * as d from '../../declarations';
import { runJest } from './jest-runner';


export async function runJestScreenshot(config: d.Config, env: d.E2EProcessEnv) {
  config.logger.debug(`screenshot connector: ${config.testing.screenshotConnector}`);

  const ScreenshotConnector = require(config.testing.screenshotConnector) as any;
  const connector: d.ScreenshotConnector = new ScreenshotConnector();

  const initTimespan = config.logger.createTimeSpan(`screenshot, initBuild started`, true);
  await connector.initBuild({
    buildId: createBuildId(),
    buildMessage: createBuildMessage(),
    buildTimestamp: Date.now(),
    rootDir: config.rootDir,
    cacheDir: config.cacheDir,
    packageDir: config.sys.compiler.packageDir,
    updateMaster: config.flags.updateScreenshot,
    logger: config.logger,
    allowableMismatchedPixels: config.testing.allowableMismatchedPixels,
    allowableMismatchedRatio: config.testing.allowableMismatchedRatio,
    pixelmatchThreshold: config.testing.pixelmatchThreshold
  });

  if (!config.flags.updateScreenshot) {
    await connector.pullMasterBuild();
  }

  initTimespan.finish(`screenshot, initBuild finished`);

  const masterBuild = await connector.getMasterBuild();

  env.__STENCIL_SCREENSHOT_BUILD__ = connector.toJson(masterBuild);

  const testsTimespan = config.logger.createTimeSpan(`screenshot, tests started`, true);

  const passed = await runJest(config, env);

  testsTimespan.finish(`screenshot, tests finished, passed: ${passed}`);

  try {
    const completeTimespan = config.logger.createTimeSpan(`screenshot, completeTimespan started`, true);
    let results = await connector.completeBuild(masterBuild);
    completeTimespan.finish(`screenshot, completeTimespan finished`);

    if (results) {
      const publishTimespan = config.logger.createTimeSpan(`screenshot, publishBuild started`, true);
      results = await connector.publishBuild(results);
      publishTimespan.finish(`screenshot, publishBuild finished`);
    }

    if (results) {
      if (config.flags.updateScreenshot) {
        // updating the master screenshot
        if (results.currentBuild && typeof results.currentBuild.previewUrl === 'string') {
          config.logger.info(config.logger.magenta(results.currentBuild.previewUrl));
        }

      } else {
        // comparing the screenshot to master
        if (results.compare) {
          config.logger.info(`screenshots compared: ${results.compare.diffs.length}`);

          if (typeof results.compare.url === 'string') {
            config.logger.info(config.logger.magenta(results.compare.url));
          }
        }
      }
    }

  } catch (e) {
    config.logger.error(e, e.stack);
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
