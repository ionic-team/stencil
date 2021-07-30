const browserStack = !!process.env.CI;
process.env.CHROME_BIN = require('puppeteer').executablePath();

var browserStackLaunchers = {
  bs_chrome: {
    base: 'BrowserStack',
    browser: 'chrome',
    os: 'Windows',
    os_version: '10',
  },
  // bs_firefox: {
  //   base: 'BrowserStack',
  //   browser: 'firefox',
  //   os: 'Windows',
  //   os_version: '10',
  // },
  bs_edge: {
    base: 'BrowserStack',
    browser: 'edge',
    os: 'Windows',
    os_version: '10',
  },
  bs_ie: {
    base: 'BrowserStack',
    browser: 'ie',
    os: 'Windows',
    os_version: '10'
  },
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
      '--headless',
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

module.exports = function (config) {
  config.set({
    failOnFailingTestSuite: false,
    plugins: ['karma-chrome-launcher', 'karma-browserstack-launcher', 'karma-ie-launcher', 'karma-edge-launcher', 'karma-jasmine', 'karma-typescript', 'karma-polyfill'],
    browsers: browserStack ? Object.keys(browserStackLaunchers) : Object.keys(localLaunchers),

    singleRun: true, // set this to false to leave the browser open

    frameworks: ['jasmine', 'karma-typescript', 'polyfill'],

    polyfill: ['Promise'],

    browserStack: {
      project: 'stencil_core',
    },

    preprocessors: {
      '**/*.ts': 'karma-typescript',
    },

    customLaunchers: browserStack ? browserStackLaunchers : {},
    urlRoot: '/__karma__/',
    files: [
      // 'test-app/prerender-test/karma.spec.ts',
      'test-app/**/*.spec.ts',
      'test-app/util.ts',
      'test-app/assets/angular.min.js',
      { pattern: 'www/**/*', watched: false, included: false, served: true, nocache: true, type: 'module' },
    ],

    proxies: {
      '/': '/base/www/',
      // '/build/testsibling.js': '/base/www/noscript.js',
      // '/esm-webpack/main.js': '/base/www/noscript.js',
    },

    colors: true,

    logLevel: config.LOG_INFO,

    reporters: ['progress'].concat(browserStack ? ['BrowserStack'] : []),

    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
    },
  });
};
