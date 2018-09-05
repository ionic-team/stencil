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

  if (config.flags.ci) {
    testing.browserArgs = testing.browserArgs || [];
    if (!testing.browserArgs.includes('--no-sandbox')) {
      testing.browserArgs.push('--no-sandbox');
    }
    if (!testing.browserArgs.includes('--disable-setuid-sandbox')) {
      testing.browserArgs.push('--disable-setuid-sandbox');
    }

    testing.browserHeadless = true;
  }

  const path = config.sys.path;

  if (!Array.isArray(testing.moduleFileExtensions)) {
    testing.moduleFileExtensions = DEFAULT_MODULE_FILE_EXTENSIONS;
  }

  if (!Array.isArray(testing.testPathIgnorePatterns)) {
    testing.testPathIgnorePatterns = DEFAULT_IGNORE_PATTERNS.map(ignorePattern => {
      return config.sys.path.join(config.rootDir, ignorePattern);
    });

    config.outputTargets.forEach((outputTarget: d.OutputTargetWww) => {
      if (outputTarget.dir) {
        testing.testPathIgnorePatterns.push(outputTarget.dir);
      }
    });
  }

  if (typeof testing.setupTestFrameworkScriptFile !== 'string') {
    testing.setupTestFrameworkScriptFile = path.join(
      config.sys.compiler.packageDir, 'testing', 'jest.setuptest.js'
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

  if (Array.isArray(testing.testMatch)) {
    delete testing.testRegex;

  } else if (typeof testing.testRegex === 'string') {
    delete testing.testMatch;

  } else {
    const types: string[] = [];
    if (config.flags.e2e) {
      types.push('e2e');
    }
    if (config.flags.spec) {
      types.push('spec');
    }

    testing.testMatch = [
      `**/+(*.)+(${types.join('|')}).+(ts|tsx|js)?(x)`
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
