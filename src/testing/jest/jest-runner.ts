import * as d from '../../declarations';
import { normalizePath } from '../../compiler/util';
import { setScreenshotEmulateData } from '../puppeteer/puppeteer-emulate';
import * as cp from 'child_process';
import * as path from 'path';


export async function runJest(config: d.Config, jestConfigPath: string, doScreenshots: boolean) {
  if (doScreenshots) {
    const emulateDevices = config.testing.emulate;
    if (Array.isArray(emulateDevices)) {

      for (let i = 0; i < emulateDevices.length; i++) {
        const emulate = emulateDevices[i];
        await runJestDevice(config, jestConfigPath, emulate);
      }
      return;
    }
  }

  await runJestDevice(config, jestConfigPath, null);
}


export async function runJestDevice(config: d.Config, jestConfigPath: string, screenshotEmulate: d.EmulateConfig) {
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
    if (screenshotEmulate) {
      setScreenshotEmulateData(screenshotEmulate, jestProcessEnv);
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


export async function setupJestConfig(config: d.Config) {
  const jestConfigPath = path.join(config.rootDir, STENCIL_JEST_CONFIG);

  config.logger.debug(`jest config: ${jestConfigPath}`);

  const jestConfig: any = {};
  Object.keys(config.testing).forEach(testingConfig => {
    if (JEST_CONFIG.includes(testingConfig)) {
      jestConfig[testingConfig] = (config.testing as any)[testingConfig];
    }
  });

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


const STENCIL_JEST_CONFIG = '.stencil.jest.config.json';


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
