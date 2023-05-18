import { buildError, isOutputTargetDist, isOutputTargetWww, isString } from '@utils';
import { basename, dirname, isAbsolute, join } from 'path';

import type * as d from '../../declarations';
import { isLocalModule } from '../sys/resolve/resolve-utils';

export const validateTesting = (config: d.ValidatedConfig, diagnostics: d.Diagnostic[]) => {
  const testing = (config.testing = Object.assign({}, config.testing || {}));

  if (!config.flags.e2e && !config.flags.spec) {
    return;
  }

  let configPathDir = config.configPath!;
  if (isString(configPathDir)) {
    if (basename(configPathDir).includes('.')) {
      configPathDir = dirname(configPathDir);
    }
  } else {
    configPathDir = config.rootDir!;
  }

  if (typeof config.flags.headless === 'boolean' || config.flags.headless === 'new') {
    testing.browserHeadless = config.flags.headless;
  } else if (typeof testing.browserHeadless !== 'boolean' && testing.browserHeadless !== 'new') {
    testing.browserHeadless = true;
  }

  if (!testing.browserWaitUntil) {
    testing.browserWaitUntil = 'load';
  }

  testing.browserArgs = testing.browserArgs || [];
  addTestingConfigOption(testing.browserArgs, '--font-render-hinting=medium');
  addTestingConfigOption(testing.browserArgs, '--incognito');

  if (config.flags.ci) {
    addTestingConfigOption(testing.browserArgs, '--no-sandbox');
    addTestingConfigOption(testing.browserArgs, '--disable-setuid-sandbox');
    addTestingConfigOption(testing.browserArgs, '--disable-dev-shm-usage');
    testing.browserHeadless = testing.browserHeadless === 'new' ? 'new' : true;
  } else if (config.flags.devtools || testing.browserDevtools) {
    testing.browserDevtools = true;
    testing.browserHeadless = false;
  }

  if (typeof testing.rootDir === 'string') {
    if (!isAbsolute(testing.rootDir)) {
      testing.rootDir = join(config.rootDir!, testing.rootDir);
    }
  } else {
    testing.rootDir = config.rootDir;
  }

  if (typeof config.flags.screenshotConnector === 'string') {
    testing.screenshotConnector = config.flags.screenshotConnector;
  }

  if (typeof testing.screenshotConnector === 'string') {
    if (!isAbsolute(testing.screenshotConnector)) {
      testing.screenshotConnector = join(config.rootDir!, testing.screenshotConnector);
    }
  } else {
    testing.screenshotConnector = join(
      config.sys!.getCompilerExecutingPath(),
      '..',
      '..',
      'screenshot',
      'local-connector.js'
    );
  }

  if (!Array.isArray(testing.testPathIgnorePatterns)) {
    testing.testPathIgnorePatterns = DEFAULT_IGNORE_PATTERNS.map((ignorePattern) => {
      return join(testing.rootDir!, ignorePattern);
    });

    (config.outputTargets ?? [])
      .filter(
        (o): o is d.OutputTargetWww | d.OutputTargetDist => (isOutputTargetDist(o) || isOutputTargetWww(o)) && !!o.dir
      )
      .forEach((outputTarget) => {
        testing.testPathIgnorePatterns?.push(outputTarget.dir!);
      });
  }

  if (typeof testing.preset !== 'string') {
    testing.preset = join(config.sys!.getCompilerExecutingPath(), '..', '..', 'testing');
  } else if (!isAbsolute(testing.preset)) {
    testing.preset = join(configPathDir, testing.preset);
  }

  if (!Array.isArray(testing.setupFilesAfterEnv)) {
    testing.setupFilesAfterEnv = [];
  }

  testing.setupFilesAfterEnv.unshift(
    join(config.sys!.getCompilerExecutingPath(), '..', '..', 'testing', 'jest-setuptestframework.js')
  );

  if (isString(testing.testEnvironment)) {
    if (!isAbsolute(testing.testEnvironment) && isLocalModule(testing.testEnvironment)) {
      testing.testEnvironment = join(configPathDir, testing.testEnvironment);
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
    /**
     * The test regex covers cases of:
     * - files under a `__tests__` directory
     * - the case where a test file has a name such as `test.ts`, `spec.ts` or `e2e.ts`.
     *   - these files can use any of the following file extensions: .ts, .tsx, .js, .jsx.
     *   - this regex only handles the entire path of a file, e.g. `/some/path/e2e.ts`
     * - the case where a test file ends with `.test.ts`, `.spec.ts`, or `.e2e.ts`.
     *   - these files can use any of the following file extensions: .ts, .tsx, .js, .jsx.
     *   - this regex case shall match file names such as `my-cmp.spec.ts`, `test.spec.ts`
     *   - this regex case shall not match file names such as `attest.ts`, `bespec.ts`
     */
    testing.testRegex = '(/__tests__/.*|(\\.|/)(test|spec|e2e))\\.[jt]sx?$';
  }

  if (Array.isArray(testing.testMatch)) {
    delete testing.testRegex;
  } else if (typeof testing.testRegex === 'string') {
    delete testing.testMatch;
  }

  if (typeof testing.runner !== 'string') {
    testing.runner = join(config.sys!.getCompilerExecutingPath(), '..', '..', 'testing', 'jest-runner.js');
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
        },
      },
    ];
  }
};

const addTestingConfigOption = (setArray: string[], option: string) => {
  if (!setArray.includes(option)) {
    setArray.push(option);
  }
};

const DEFAULT_ALLOWABLE_MISMATCHED_PIXELS = 100;
const DEFAULT_PIXEL_MATCH_THRESHOLD = 0.1;
const DEFAULT_IGNORE_PATTERNS = ['.vscode', '.stencil', 'node_modules'];
