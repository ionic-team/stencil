var path = require('path');
const browserStack = !!process.env.CI;
process.env.CHROME_BIN = require('puppeteer').executablePath()

var browserStackLaunchers = {
  bs_chrome: {
    base: 'BrowserStack',
    browser: 'chrome',
    os: 'Windows',
    os_version: '10'
  },
  bs_firefox: {
    base: 'BrowserStack',
    browser: 'firefox',
    os: 'Windows',
    os_version: '10'
  },
  bs_edge: {
    base: 'BrowserStack',
    browser: 'edge',
    os: 'Windows',
    os_version: '10'
  },
  bs_ie: {
    base: 'BrowserStack',
    browser: 'ie',
    os: 'Windows',
    os_version: '10'
  },
  bs_safari: {
    base: 'BrowserStack',
    browser: 'safari',
    os: 'OS X',
    os_version: 'High Sierra'
  }
};

const localLaunchers = {
  ChromeHeadless: {
    base: 'Chrome',
    flags: [
			'--no-sandbox',
			// See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
			'--headless',
			'--disable-gpu',
			// Without a remote debugging port, Google Chrome exits immediately.
			'--remote-debugging-port=9333'
		]
  },
  'Firefox': {
    base: 'Firefox'
  }
};

module.exports = function(config) {
  config.set({
    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-browserstack-launcher',
      'karma-jasmine',
      'karma-typescript',
      'karma-polyfill'
    ],
    browsers: browserStack
      ? Object.keys(browserStackLaunchers)
      : Object.keys(localLaunchers),

    singleRun: true, // set this to false to leave the browser open

    frameworks: [
      'jasmine',
      'karma-typescript',
      'polyfill'
    ],

    polyfill: [
      'Promise'
    ],

    browserStack: {
      project: 'stencil_core'
    },

    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },

    customLaunchers: browserStack ? browserStackLaunchers : {},

    files: [
      'test-app/**/*.spec.ts',
      'test-app/util.ts',
      'www/build/testapp.js',
      'www/build/testsibling.js',
      { pattern: 'www/build/testapp/*.js', watched: false, included: false, served: true, nocache: false },
      { pattern: 'www/build/testsibling/*.js', watched: false, included: false, served: true, nocache: false },
      { pattern: 'www/**/*.html', watched: false, included: false, served: true, nocache: false },
    ],

    colors: true,

    logLevel: config.LOG_INFO,

    proxies: {
      '/www/app/*.js': '/base/www/app/*.js',
      '/www/**/*.html': '/base/www/**/*.html'
    },

    reporters: ['progress'].concat(browserStack
      ? [ 'BrowserStack' ]
      : []),

    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json'
    },
  });
};
