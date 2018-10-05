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
    rootDir: config.rootDir,
    cacheDir: config.cacheDir,
    packageDir: config.sys.compiler.packageDir,
    updateMaster: config.flags.updateScreenshot,
    logger: config.logger,
    allowableMismatchedPixels: config.testing.allowableMismatchedPixels,
    allowableMismatchedRatio: config.testing.allowableMismatchedRatio,
    pixelmatchThreshold: config.testing.pixelmatchThreshold
  });
  initTimespan.finish(`screenshot, initBuild finished`);

  env.__STENCIL_SCREENSHOT_BUILD__ = await connector.toJson();

  const testsTimespan = config.logger.createTimeSpan(`screenshot, tests started`, true);

  const passed = await runJest(config, env);

  testsTimespan.finish(`screenshot, tests finished, passed: ${passed}`);

  try {
    const completeTimespan = config.logger.createTimeSpan(`screenshot, completeTimespan started`, true);
    const currentBuild = await connector.completeBuild();
    completeTimespan.finish(`screenshot, completeTimespan finished`);

    let publishResults: d.PublishBuildResults = null;
    if (currentBuild) {
      const publishTimespan = config.logger.createTimeSpan(`screenshot, publishBuild started`, true);
      publishResults = await connector.publishBuild(currentBuild);
      publishTimespan.finish(`screenshot, publishBuild finished`);
    }

    if (publishResults) {
      if (typeof publishResults.screenshotsCompared === 'number') {
        config.logger.info(`screenshots images compared: ${publishResults.screenshotsCompared}`);
      }

      if (typeof publishResults.compareUrl === 'string') {
        config.logger.info(config.logger.magenta(publishResults.compareUrl));
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

  return `Local: ${fmDt}`;
}
