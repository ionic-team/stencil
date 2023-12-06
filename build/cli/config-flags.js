/**
 * All the Boolean options supported by the Stencil CLI
 */
export const BOOLEAN_CLI_FLAGS = [
    'build',
    'cache',
    'checkVersion',
    'ci',
    'compare',
    'debug',
    'dev',
    'devtools',
    'docs',
    'e2e',
    'es5',
    'esm',
    'help',
    'log',
    'open',
    'prerender',
    'prerenderExternal',
    'prod',
    'profile',
    'serviceWorker',
    'screenshot',
    'serve',
    'skipNodeCheck',
    'spec',
    'ssr',
    'stats',
    'updateScreenshot',
    'verbose',
    'version',
    'watch',
    // JEST CLI OPTIONS
    'all',
    'automock',
    'bail',
    // 'cache', Stencil already supports this argument
    'changedFilesWithAncestor',
    // 'ci', Stencil already supports this argument
    'clearCache',
    'clearMocks',
    'collectCoverage',
    'color',
    'colors',
    'coverage',
    // 'debug', Stencil already supports this argument
    'detectLeaks',
    'detectOpenHandles',
    'errorOnDeprecated',
    'expand',
    'findRelatedTests',
    'forceExit',
    'init',
    'injectGlobals',
    'json',
    'lastCommit',
    'listTests',
    'logHeapUsage',
    'noStackTrace',
    'notify',
    'onlyChanged',
    'onlyFailures',
    'passWithNoTests',
    'resetMocks',
    'resetModules',
    'restoreMocks',
    'runInBand',
    'runTestsByPath',
    'showConfig',
    'silent',
    'skipFilter',
    'testLocationInResults',
    'updateSnapshot',
    'useStderr',
    // 'verbose', Stencil already supports this argument
    // 'version', Stencil already supports this argument
    // 'watch', Stencil already supports this argument
    'watchAll',
    'watchman',
];
/**
 * All the Number options supported by the Stencil CLI
 */
export const NUMBER_CLI_FLAGS = [
    'port',
    // JEST CLI ARGS
    'maxConcurrency',
    'testTimeout',
];
/**
 * All the String options supported by the Stencil CLI
 */
export const STRING_CLI_FLAGS = [
    'address',
    'config',
    'docsApi',
    'docsJson',
    'emulate',
    'root',
    'screenshotConnector',
    // JEST CLI ARGS
    'cacheDirectory',
    'changedSince',
    'collectCoverageFrom',
    // 'config', Stencil already supports this argument
    'coverageDirectory',
    'coverageThreshold',
    'env',
    'filter',
    'globalSetup',
    'globalTeardown',
    'globals',
    'haste',
    'moduleNameMapper',
    'notifyMode',
    'outputFile',
    'preset',
    'prettierPath',
    'resolver',
    'rootDir',
    'runner',
    'testEnvironment',
    'testEnvironmentOptions',
    'testFailureExitCode',
    'testNamePattern',
    'testResultsProcessor',
    'testRunner',
    'testSequencer',
    'testURL',
    'timers',
    'transform',
];
export const STRING_ARRAY_CLI_FLAGS = [
    'collectCoverageOnlyFrom',
    'coveragePathIgnorePatterns',
    'coverageReporters',
    'moduleDirectories',
    'moduleFileExtensions',
    'modulePathIgnorePatterns',
    'modulePaths',
    'projects',
    'reporters',
    'roots',
    'selectProjects',
    'setupFiles',
    'setupFilesAfterEnv',
    'snapshotSerializers',
    'testMatch',
    'testPathIgnorePatterns',
    'testPathPattern',
    'testRegex',
    'transformIgnorePatterns',
    'unmockedModulePathPatterns',
    'watchPathIgnorePatterns',
];
/**
 * All the CLI arguments which may have string or number values
 *
 * `maxWorkers` is an argument which is used both by Stencil _and_ by Jest,
 * which means that we need to support parsing both string and number values.
 */
export const STRING_NUMBER_CLI_FLAGS = ['maxWorkers'];
/**
 * All the CLI arguments which may have boolean or string values.
 */
export const BOOLEAN_STRING_CLI_FLAGS = [
    /**
     * `headless` is an argument passed through to Puppeteer (which is passed to Chrome) for end-to-end testing.
     * Prior to Chrome v112, `headless` was treated like a boolean flag. Starting with Chrome v112, 'new' is an accepted
     * option to support Chrome's new headless mode. In order to support this option in Stencil, both the boolean and
     * string versions of the flag must be accepted.
     *
     * {@see https://developer.chrome.com/articles/new-headless/}
     */
    'headless',
];
/**
 * All the LogLevel-type options supported by the Stencil CLI
 *
 * This is a bit silly since there's only one such argument atm,
 * but this approach lets us make sure that we're handling all
 * our arguments in a type-safe way.
 */
export const LOG_LEVEL_CLI_FLAGS = ['logLevel'];
/**
 * For a small subset of CLI options we support a short alias e.g. `'h'` for `'help'`
 */
export const CLI_FLAG_ALIASES = {
    c: 'config',
    h: 'help',
    p: 'port',
    v: 'version',
    // JEST SPECIFIC CLI FLAGS
    // these are defined in
    // https://github.com/facebook/jest/blob/4156f86/packages/jest-cli/src/args.ts
    b: 'bail',
    e: 'expand',
    f: 'onlyFailures',
    i: 'runInBand',
    o: 'onlyChanged',
    t: 'testNamePattern',
    u: 'updateSnapshot',
    w: 'maxWorkers',
};
/**
 * A regular expression which can be used to match a CLI flag for one of our
 * short aliases.
 */
export const CLI_FLAG_REGEX = new RegExp(`^-[chpvbewofitu]{1}$`);
/**
 * Helper function for initializing a `ConfigFlags` object. Provide any overrides
 * for default values and off you go!
 *
 * @param init an object with any overrides for default values
 * @returns a complete CLI flag object
 */
export const createConfigFlags = (init = {}) => {
    const flags = {
        task: null,
        args: [],
        knownArgs: [],
        unknownArgs: [],
        ...init,
    };
    return flags;
};
//# sourceMappingURL=config-flags.js.map