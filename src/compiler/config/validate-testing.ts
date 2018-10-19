import * as d from '../../declarations';


export function validateTesting(config: d.Config) {
  const testing = config.testing = config.testing || {};

  if (!config.flags || (!config.flags.e2e && !config.flags.spec)) {
    return;
  }

  if (typeof config.flags.headless === 'boolean') {
    testing.browserHeadless = config.flags.headless;
  } else if (typeof testing.browserHeadless !== 'boolean') {
    testing.browserHeadless = true;
  }

  testing.browserArgs = testing.browserArgs || [];
  addOption(testing.browserArgs, '--disable-gpu');
  addOption(testing.browserArgs, '--disable-canvas-aa');
  addOption(testing.browserArgs, '--disable-composited-antialiasing');
  addOption(testing.browserArgs, '--disable-composited-antialiasing');

  if (config.flags.ci) {
    addOption(testing.browserArgs, '--no-sandbox');
    addOption(testing.browserArgs, '--disable-setuid-sandbox');
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
    testing.screenshotConnector = config.sys.path.join(
      config.sys.compiler.packageDir, 'screenshot', 'local-connector.js'
    );
  }

  if (!Array.isArray(testing.moduleFileExtensions)) {
    testing.moduleFileExtensions = DEFAULT_MODULE_FILE_EXTENSIONS;
  }

  if (!Array.isArray(testing.testPathIgnorePatterns)) {
    testing.testPathIgnorePatterns = DEFAULT_IGNORE_PATTERNS.map(ignorePattern => {
      return config.sys.path.join(testing.rootDir, ignorePattern);
    });

    config.outputTargets.forEach((outputTarget: d.OutputTargetWww) => {
      if (outputTarget.dir) {
        testing.testPathIgnorePatterns.push(outputTarget.dir);
      }
    });
  }

  if (typeof testing.setupTestFrameworkScriptFile !== 'string') {
    testing.setupTestFrameworkScriptFile = path.join(
      config.sys.compiler.packageDir, 'testing', 'jest.setuptestframework.js'
    );

  } else if (!path.isAbsolute(testing.setupTestFrameworkScriptFile)) {
    testing.setupTestFrameworkScriptFile = path.join(
      config.configPath,
      testing.setupTestFrameworkScriptFile
    );
  }

  if (typeof testing.testEnvironment !== 'string') {
    testing.testEnvironment = path.join(
      config.sys.compiler.packageDir, 'testing', 'jest.environment.js'
    );

  } else if (!path.isAbsolute(testing.testEnvironment)) {
    testing.testEnvironment = path.join(
      config.configPath,
      testing.testEnvironment
    );
  }

  if (typeof testing.allowableMismatchedPixels === 'number') {
    if (testing.allowableMismatchedPixels < 0) {
      throw new Error(`allowableMismatchedPixels must be a value that is 0 or greater`);
    }

  } else {
    testing.allowableMismatchedPixels = DEFAULT_ALLOWABLE_MISMATCHED_PIXELS;
  }

  if (typeof testing.allowableMismatchedRatio === 'number') {
    if (testing.allowableMismatchedRatio < 0 || testing.allowableMismatchedRatio > 1) {
      throw new Error(`allowableMismatchedRatio must be a value ranging from 0 to 1`);
    }
  }

  if (typeof testing.pixelmatchThreshold === 'number') {
    if (testing.pixelmatchThreshold < 0 || testing.pixelmatchThreshold > 1) {
      throw new Error(`pixelmatchThreshold must be a value ranging from 0 to 1`);
    }

  } else {
    testing.pixelmatchThreshold = DEFAULT_PIXEL_MATCH_THRESHOLD;
  }

  if (Array.isArray(testing.testMatch)) {
    delete testing.testRegex;

  } else if (typeof testing.testRegex === 'string') {
    delete testing.testMatch;

  } else {
    testing.testMatch = [
      `**/*(*.)+(e2e|spec).+(ts)?(x)`
    ];
  }

  if (typeof testing.runner !== 'string') {
    testing.runner = path.join(
      config.sys.compiler.packageDir, 'testing', 'jest.runner.js'
    );
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

  testing.transform = testing.transform || {};

  if (typeof testing.transform[DEFAULT_TS_TRANSFORM] !== 'string') {
    testing.transform[DEFAULT_TS_TRANSFORM] = path.join(
      config.sys.compiler.packageDir, 'testing', 'jest.preprocessor.js'
    );

  } else if (!path.isAbsolute(testing.transform[DEFAULT_TS_TRANSFORM])) {
    testing.transform[DEFAULT_TS_TRANSFORM] = path.join(
      config.configPath,
      testing.transform[DEFAULT_TS_TRANSFORM]
    );
  }

}

const DEFAULT_TS_TRANSFORM = '^.+\\.(ts|tsx)$';

const DEFAULT_MODULE_FILE_EXTENSIONS = [
  'ts',
  'tsx',
  'js',
  'json'
];

const DEFAULT_IGNORE_PATTERNS = [
  '.vscode',
  '.stencil',
  'node_modules',
];

function addOption(setArray: string[], option: string) {
  if (!setArray.includes(option)) {
    setArray.push(option);
  }
}


const DEFAULT_ALLOWABLE_MISMATCHED_PIXELS = 100;
const DEFAULT_PIXEL_MATCH_THRESHOLD = 0.1;
