import * as d from '../../declarations';
import { buildJestArgv, getProjectListFromCLIArgs } from './jest-config';
import { setScreenshotEmulateData } from '../puppeteer/puppeteer-emulate';
import * as path from 'path';


export async function runJest(config: d.Config, env: d.E2EProcessEnv, _doScreenshots: boolean) {
  env.__STENCIL_EMULATE_CONFIGS__ = JSON.stringify(config.testing.emulate);

  const { runCLI } = require('jest-cli');

  const jestArgv = buildJestArgv(config);
  const projects = getProjectListFromCLIArgs(config, jestArgv);

  const cliResults = await runCLI(jestArgv, projects);

  return Promise.resolve(cliResults.results.success);
}


const TestRunner = require('jest-runner');
export class StencilTestRunner extends TestRunner {

  async runTests(tests: { path: string }[], watcher: any, onStart: any, onResult: any, onFailure: any, options: any) {
    const env = (process.env as d.E2EProcessEnv);

    tests = tests.filter(t => {
      if (t.path.includes('.e2e.') && env.__STENCIL_E2E_TESTS__ === 'true') {
        return true;
      }
      if (t.path.includes('.spec.') && env.__STENCIL_SPEC_TESTS__ === 'true') {
        return true;
      }
      return false;
    });

    const emulateConfigsStr = env.__STENCIL_EMULATE_CONFIGS__;

    const emulateConfigs = JSON.parse(emulateConfigsStr) as d.EmulateConfig[];

    for (let i = 0; i < emulateConfigs.length; i++) {
      const emulateConfig = emulateConfigs[i];

      tests = tests.map(test => {
        env.__STENCIL_EMULATE__ = JSON.stringify(emulateConfig);
        return test;
      });

      await super.runTests(tests, watcher, onStart, onResult, onFailure, options);
    }
  }

}


export async function runJestScreenshot(config: d.Config, env: d.E2EProcessEnv,  emulateDevices: d.EmulateConfig[]) {
  config.logger.debug(`screenshot connector: ${config.testing.screenshotConnector}`);

  const ScreenshotConnector = require(config.testing.screenshotConnector) as any;
  const connector: d.ScreenshotConnector = new ScreenshotConnector();

  const initTimespan = config.logger.createTimeSpan(`screenshot, initBuild started`, true);
  await connector.initBuild({
    buildId: createBuildId(),
    buildMessage: createBuildMessage(),
    rootDir: config.rootDir,
    cacheDir: config.cacheDir,
    compareAppDir: path.join(config.sys.compiler.packageDir, 'screenshot', 'compare'),
    updateMaster: config.flags.updateScreenshot,
    logger: config.logger,
    allowableMismatchedPixels: config.testing.allowableMismatchedPixels,
    allowableMismatchedRatio: config.testing.allowableMismatchedRatio,
    pixelmatchThreshold: config.testing.pixelmatchThreshold
  });
  initTimespan.finish(`screenshot, initBuild finished`);

  env.__STENCIL_SCREENSHOT_BUILD__ = connector.toJson();

  const testsTimespan = config.logger.createTimeSpan(`screenshot, tests started`, true);

  let passed = true;

  for (let i = 0; i < emulateDevices.length; i++) {
    const emulate = emulateDevices[i];
    try {
      await runJestDevice(config, emulate);
    } catch (e) {
      passed = false;
    }
  }

  testsTimespan.finish(`screenshot, tests finished`);

  const completeTimespan = config.logger.createTimeSpan(`screenshot, completeTimespan started`, true);
  await connector.completeBuild();
  completeTimespan.finish(`screenshot, completeTimespan finished`);

  const publishTimespan = config.logger.createTimeSpan(`screenshot, publishBuild started`, true);
  await connector.publishBuild();
  publishTimespan.finish(`screenshot, publishBuild finished`);

  config.logger.info(`screenshots images compared: ${connector.getTotalScreenshotImages()}`);
  config.logger.info(config.logger.magenta(connector.getComparisonSummaryUrl()));

  return passed;
}


export async function runJestDevice(config: d.Config, emulateDevice: d.EmulateConfig) {
  if (emulateDevice) {
    config.logger.info(`screenshot emulate: ${emulateDevice.device || emulateDevice.userAgent}`);
    setScreenshotEmulateData(emulateDevice, process.env);
  }

  const { runCLI } = require('jest-cli');

  const jestArgv = buildJestArgv(config);
  const projects = getProjectListFromCLIArgs(config, jestArgv);

  const results = await runCLI(jestArgv, projects);
  console.log(results);
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
