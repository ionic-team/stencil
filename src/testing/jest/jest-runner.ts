import * as d from '../../declarations';
import { normalizePath } from '../../compiler/util';
import { setScreenshotEmulateData } from '../puppeteer/puppeteer-emulate';
import * as cp from 'child_process';
import * as path from 'path';


export async function runJest(config: d.Config, env: d.E2EProcessEnv, jestConfigPath: string, doScreenshots: boolean) {
  if (doScreenshots) {
    const emulateDevices = config.testing.emulate;
    if (Array.isArray(emulateDevices)) {
      return await runJestScreenshot(config, env, jestConfigPath, emulateDevices);
    }
  }

  let passed = true;

  try {
    await runJestDevice(config, jestConfigPath, null);
  } catch (e) {
    passed = false;
  }

  return passed;
}


export async function runJestScreenshot(config: d.Config, env: d.E2EProcessEnv, jestConfigPath: string, emulateDevices: d.EmulateConfig[]) {
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
      await runJestDevice(config, jestConfigPath, emulate);
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


export async function runJestDevice(config: d.Config, jestConfigPath: string, emulateDevice: d.EmulateConfig) {
  const jestPkgJsonPath = config.sys.resolveModule(config.rootDir, 'jest');
  const jestPkgJson: d.PackageJsonData = require(jestPkgJsonPath);
  const jestBinModule = path.join(normalizePath(path.dirname(jestPkgJsonPath)), jestPkgJson.bin.jest);

  const args = [
    '--config', jestConfigPath,
    ...getJestArgs(config)
  ];

  if (config.watch) {
    args.push('--watch');
  }

  config.logger.debug(`jest module: ${jestBinModule}`);
  config.logger.debug(`jest args: ${args.join(' ')}`);

  return new Promise((resolve, reject) => {

    const jestProcessEnv = Object.assign({}, process.env as d.E2EProcessEnv);
    if (emulateDevice) {
      config.logger.info(`screenshot emulate: ${emulateDevice.device || emulateDevice.userAgent}`);
      setScreenshotEmulateData(emulateDevice, jestProcessEnv);
    }

    const p = cp.fork(jestBinModule, args, {
      cwd: config.testing.rootDir,
      env: jestProcessEnv
    });

    p.on(`unhandledRejection`, (r) => {
      reject(r);
    });

    p.once('exit', (d) => {
      if (d === 0) {
        resolve();
      } else {
        reject('tests failed');
      }
    });

    p.once('error', err => {
      reject(err.message);
    });

  });
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



export async function setupJestConfig(config: d.Config) {
  const jestConfigPath = path.join(config.cacheDir, STENCIL_JEST_CONFIG);

  config.logger.debug(`jest config: ${jestConfigPath}`);

  const jestConfig: any = {};
  Object.keys(config.testing).forEach(testingConfig => {
    if (JEST_CONFIG.includes(testingConfig)) {
      jestConfig[testingConfig] = (config.testing as any)[testingConfig];
    }
  });

  if (typeof jestConfig.rootDir !== 'string') {
    jestConfig.rootDir = config.rootDir;
  }

  await config.sys.fs.writeFile(
    jestConfigPath,
    JSON.stringify(jestConfig, null, 2)
  );

  return jestConfigPath;
}

const JEST_CONFIG = [
  'automock',
  'bail',
  'browser',
  'cacheDirectory',
  'clearMocks',
  'collectCoverage',
  'collectCoverageFrom',
  'coverageDirectory',
  'coveragePathIgnorePatterns',
  'coverageReporters',
  'coverageThreshold',
  'errorOnDeprecated',
  'forceCoverageMatch',
  'globals',
  'globalSetup',
  'globalTeardown',
  'moduleDirectories',
  'moduleFileExtensions',
  'moduleNameMapper',
  'modulePathIgnorePatterns',
  'modulePaths',
  'notify',
  'notifyMode',
  'preset',
  'prettierPath',
  'projects',
  'reporters',
  'resetMocks',
  'resetModules',
  'resolver',
  'restoreMocks',
  'rootDir',
  'roots',
  'runner',
  'setupFiles',
  'setupTestFrameworkScriptFile',
  'snapshotSerializers',
  'testEnvironment',
  'testEnvironmentOptions',
  'testMatch',
  'testPathIgnorePatterns',
  'testRegex',
  'testResultsProcessor',
  'testRunner',
  'testURL',
  'timers',
  'transform',
  'transformIgnorePatterns',
  'unmockedModulePathPatterns',
  'verbose',
  'watchPathIgnorePatterns',
];


const STENCIL_JEST_CONFIG = 'stencil.jest.config.json';


function getJestArgs(config: d.Config) {
  const args: string[] = [];

  if (config.flags && config.flags.args) {
    config.flags.args.forEach(arg => {
      if (JEST_ARGS.includes(arg)) {
        args.push(arg);
      } else if (JEST_ARGS.some(jestArg => arg.startsWith(jestArg))) {
        args.push(arg);
      }
    });
  }

  if (config.logger.level === 'debug') {
    if (!args.includes('--detectOpenHandles')) {
      args.push('--detectOpenHandles');
    }
  }

  return args;
}

const JEST_ARGS = [
  '--bail',
  '--cache',
  '--changedFilesWithAncestor',
  '--changedSince',
  '--clearCache',
  '--collectCoverageFrom=',
  '--colors',
  '--config=',
  '--coverage',
  '--debug',
  '--detectOpenHandles',
  '--env=',
  '--errorOnDeprecated',
  '--expand',
  '--findRelatedTests',
  '--forceExit',
  '--help',
  '--init',
  '--json',
  '--outputFile=',
  '--lastCommit',
  '--listTests',
  '--logHeapUsage',
  '--maxWorkers=',
  '--noStackTrace',
  '--notify',
  '--onlyChanged',
  '--passWithNoTests',
  '--reporters',
  '--runInBand',
  '--setupTestFrameworkScriptFile=',
  '--showConfig',
  '--silent',
  '--testNamePattern=',
  '--testLocationInResults',
  '--testPathPattern=',
  '--testRunner=',
  '--updateSnapshot',
  '--useStderr',
  '--verbose',
  '--version',
  '--watch',
  '--watchAll',
  '--watchman',
];
