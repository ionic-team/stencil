import * as d from '../../declarations';
import { isOutputTargetDist, isOutputTargetWww } from '../../compiler/output-targets/output-utils';
import { buildError, buildWarn } from '@utils';


export function validateTesting(config: d.Config, diagnostics: d.Diagnostic[]) {
  const testing = config.testing = Object.assign({}, config.testing || {});

  if (!config.flags || (!config.flags.e2e && !config.flags.spec)) {
    return;
  }

  if (typeof config.flags.headless === 'boolean') {
    testing.browserHeadless = config.flags.headless;
  } else if (typeof testing.browserHeadless !== 'boolean') {
    testing.browserHeadless = true;
  }

  if (!testing.browserWaitUntil) {
    testing.browserWaitUntil = 'load';
  }

  testing.browserArgs = testing.browserArgs || [];
  addOption(testing.browserArgs, '--font-render-hinting=medium');
  addOption(testing.browserArgs, '--incognito');

  if (config.flags.ci) {
    addOption(testing.browserArgs, '--no-sandbox');
    addOption(testing.browserArgs, '--disable-setuid-sandbox');
    addOption(testing.browserArgs, '--disable-dev-shm-usage');
    testing.browserHeadless = true;
  }

  const path = config.sys.path;

  if (typeof testing.rootDir === 'string') {
    if (!path.isAbsolute(testing.rootDir)) {
      testing.rootDir = path.join(config.rootDir, testing.rootDir);
    }

  } else {
    testing.rootDir = config.rootDir;
  }

  if (config.flags && typeof config.flags.screenshotConnector === 'string') {
    testing.screenshotConnector = config.flags.screenshotConnector;
  }

  if (typeof testing.screenshotConnector === 'string') {
    if (!path.isAbsolute(testing.screenshotConnector)) {
      testing.screenshotConnector = path.join(config.rootDir, testing.screenshotConnector);
    }

  } else {
    testing.screenshotConnector = path.join(
      config.sys_next.getCompilerExecutingPath(), '..', '..', 'screenshot', 'local-connector.js'
    );
  }

  if (!Array.isArray(testing.testPathIgnorePatterns)) {
    testing.testPathIgnorePatterns = DEFAULT_IGNORE_PATTERNS.map(ignorePattern => {
      return path.join(testing.rootDir, ignorePattern);
    });

    config.outputTargets.filter(o => (isOutputTargetDist(o) || isOutputTargetWww(o)) && o.dir).forEach((outputTarget: d.OutputTargetWww) => {
      testing.testPathIgnorePatterns.push(outputTarget.dir);
    });
  }

  if (typeof testing.preset !== 'string') {
    testing.preset = path.join(
      config.sys_next.getCompilerExecutingPath(), '..', '..', 'testing'
    );

  } else if (!path.isAbsolute(testing.preset)) {
    testing.preset = path.join(
      config.configPath,
      testing.preset
    );
  }

  if (!Array.isArray(testing.setupFilesAfterEnv)) {
    testing.setupFilesAfterEnv = [];

  }

  testing.setupFilesAfterEnv.unshift(
    path.join(config.sys_next.getCompilerExecutingPath(), '..', '..', 'testing', 'jest-setuptestframework.js')
  );
  if (testing.setupTestFrameworkScriptFile) {
    const err = buildWarn(diagnostics);
    err.messageText = `setupTestFrameworkScriptFile has been deprecated.`;
  }

  if (typeof testing.testEnvironment === 'string') {
    if (!path.isAbsolute(testing.testEnvironment)) {
      testing.testEnvironment = path.join(
        config.configPath,
        testing.testEnvironment
      );
    }
  }

  if (typeof testing.allowableMismatchedPixels === 'number') {
    if (testing.allowableMismatchedPixels < 0) {
      const err = buildError(diagnostics);
      err.messageText = `allowableMismatchedPixels must be a value that is 0 or greater`;
    }

  } else {
    testing.allowableMismatchedPixels = DEFAULT_ALLOWABLE_MISMATCHED_PIXELS;
  }

  if (typeof testing.allowableMismatchedRatio === 'number') {
    if (testing.allowableMismatchedRatio < 0 || testing.allowableMismatchedRatio > 1) {
      const err = buildError(diagnostics);
      err.messageText = `allowableMismatchedRatio must be a value ranging from 0 to 1`;
    }
  }

  if (typeof testing.pixelmatchThreshold === 'number') {
    if (testing.pixelmatchThreshold < 0 || testing.pixelmatchThreshold > 1) {
      const err = buildError(diagnostics);
      err.messageText = `pixelmatchThreshold must be a value ranging from 0 to 1`;
    }

  } else {
    testing.pixelmatchThreshold = DEFAULT_PIXEL_MATCH_THRESHOLD;
  }

  if (testing.testRegex === undefined) {
    testing.testRegex = '(/__tests__/.*|\\.?(test|spec|e2e))\\.(tsx?|ts?|jsx?|js?)$';
  }

  if (Array.isArray(testing.testMatch)) {
    delete testing.testRegex;

  } else if (typeof testing.testRegex === 'string') {
    delete testing.testMatch;

  }

  if (typeof testing.runner !== 'string') {
    testing.runner = path.join(
      config.sys_next.getCompilerExecutingPath(), '..', '..', 'testing', 'jest-runner.js'
    );
  }

  if (typeof testing.waitBeforeScreenshot === 'number') {
    if (testing.waitBeforeScreenshot < 0) {
      const err = buildError(diagnostics);
      err.messageText = `waitBeforeScreenshot must be a value that is 0 or greater`;
    }
  } else {
    testing.waitBeforeScreenshot = 10;
  }

  if (!Array.isArray(testing.emulate) || testing.emulate.length === 0) {
    testing.emulate = [
      {
        userAgent: 'default',
        viewport: {
          width: 600,
          height: 600,
          deviceScaleFactor: 1,
          isMobile: false,
          hasTouch: false,
          isLandscape: false,
        }
      }
    ];
  }
}


function addOption(setArray: string[], option: string) {
  if (!setArray.includes(option)) {
    setArray.push(option);
  }
}


const DEFAULT_ALLOWABLE_MISMATCHED_PIXELS = 100;
const DEFAULT_PIXEL_MATCH_THRESHOLD = 0.1;
const DEFAULT_IGNORE_PATTERNS = [
  '.vscode',
  '.stencil',
  'node_modules',
];
