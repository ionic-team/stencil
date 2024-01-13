const path = require('path');

const { WWW_OUT_DIR } = require('./constants');

process.env.CHROME_BIN = require('puppeteer').executablePath();

// determine the environment to run in
const isCI = !!process.env.CI;
const localBrowserStackConnection = !isCI && !!process.env.LOCAL_BROWSERSTACK;
const useBrowserStack = isCI || localBrowserStackConnection;

const browserStackLaunchers = {
  bs_chrome: {
    base: 'BrowserStack',
    browser: 'chrome',
    os: 'Windows',
    os_version: '10',
  },
  bs_firefox: {
    base: 'BrowserStack',
    browser: 'firefox',
    os: 'Windows',
    os_version: '10',
  },
  bs_edge: {
    base: 'BrowserStack',
    browser: 'edge',
    os: 'Windows',
    os_version: '10',
  },
  // bs_ie: {
  //   base: 'BrowserStack',
  //   browser: 'ie',
  //   os: 'Windows',
  //   os_version: '10'
  // },
  // bs_safari: {
  //   base: 'BrowserStack',
  //   browser: 'safari',
  //   os: 'OS X',
  //   os_version: 'Mojave'
  // }
};

const localLaunchers = {
  ChromeHeadless: {
    base: 'ChromeHeadless',
    flags: [
      '--no-sandbox',
      // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
      '--headless=new',
      '--disable-gpu',
      // Without a remote debugging port, Google Chrome exits immediately.
      '--remote-debugging-port=9333',
    ],
  },
};

if (process.platform === 'win32') {
  localLaunchers.IE = {
    base: 'IE',
  };
  localLaunchers.Edge = {
    base: 'Edge',
  };
} else if (process.platform === 'darwin') {
  // localLaunchers.Safari = {
  //   base: 'Safari'
  // };
}

// this configuration shall be used in a CI environment (specifically, GitHub Actions)
const ciBrowserstackConfig = {
  startTunnel: false,
  // set by browserstack/github-actions/setup-local
  localIdentifier: process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
};

// this configuration shall be used locally, creating a tunnel to Browserstack from your machine.
// See the README for instructions to connect to Browserstack from your local environment
const localBrowserstackConfig = {
  startTunnel: true,
};

module.exports = function (config) {
  config.set({
    plugins: [
      'karma-chrome-launcher',
      'karma-browserstack-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-edge-launcher',
      'karma-jasmine',
      'karma-typescript',
      'karma-polyfill',
    ],
    browsers: useBrowserStack ? Object.keys(browserStackLaunchers) : Object.keys(localLaunchers),

    singleRun: true, // set this to false to leave the browser open

    frameworks: ['jasmine', 'karma-typescript', 'polyfill'],

    polyfill: ['Promise'],

    browserStack: {
      // identifier for all browser runs in BrowserStack
      project: 'stencil_core',
      ...(isCI ? ciBrowserstackConfig : localBrowserstackConfig),
    },

    preprocessors: {
      '**/*.ts': 'karma-typescript',
    },

    customLaunchers: useBrowserStack ? browserStackLaunchers : {},
    urlRoot: '/__karma__/',
    files: [
      // 'test-app/prerender-test/karma.spec.ts',
      'test-app/**/*.spec.ts', // tells karma these are tests we need to serve & run
      'test-app/util.ts', // used by 'www' output target tests to load components
      'test-app/assets/angular.min.js', // used by a 'www' output target test
      {
        pattern: path.join(WWW_OUT_DIR, '/**/*'),
        watched: false,
        included: false,
        served: true,
        nocache: true,
        type: 'module',
      },
    ],

    proxies: {
      '/': `/base/${WWW_OUT_DIR}/`,
    },

    colors: true,

    logLevel: config.LOG_INFO,

    reporters: ['progress'].concat(useBrowserStack ? ['BrowserStack'] : []),

    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      bundlerOptions: {
        transforms: [require('karma-typescript-es6-transform')()],
        resolve: {
          alias: {
            '@stencil/core': '../../internal/index.js',
            '@stencil/core/internal': '../../internal/index.js',
            '@stencil/core/internal/client': '../../internal/client/index.js',
            '@stencil/core/internal/app-data': '../../internal/app-data/index.js',
            '@stencil/core/testing': '../../testing/index.js',
          },
        },
        acornOptions: {
          ecmaVersion: 11,
        },
      },
    },
  });
};
