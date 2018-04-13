var path = require('path');
process.env.CHROME_BIN = require('puppeteer').executablePath()

const coverage = String(process.env.COVERAGE) === 'true';
const ci = String(process.env.CI).match(/^(1|true)$/gi);
const pullRequest = !String(process.env.TRAVIS_PULL_REQUEST).match(/^(0|false|undefined)$/gi);
const masterBranch = String(process.env.TRAVIS_BRANCH).match(/^master$/gi);
// const sauceLabs = ci && !pullRequest && masterBranch;
const sauceLabs = true;
const performance = !coverage && String(process.env.PERFORMANCE)!=='false';

var sauceLabsLaunchers = {
	sl_chrome: {
		base: 'SauceLabs',
		browserName: 'chrome',
		platform: 'Windows 10'
  },
	sl_firefox: {
		base: 'SauceLabs',
		browserName: 'firefox',
		platform: 'Windows 10'
	},
	sl_safari: {
		base: 'SauceLabs',
		browserName: 'safari',
		platform: 'OS X 10.11'
	},
	sl_edge: {
		base: 'SauceLabs',
		browserName: 'MicrosoftEdge',
		platform: 'Windows 10'
	},
	sl_ie_11: {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		version: '11.103',
		platform: 'Windows 10'
	},
	sl_ie_10: {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		version: '10.0',
		platform: 'Windows 7'
	},
	sl_ie_9: {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		version: '9.0',
		platform: 'Windows 7'
  }
};

var browserStackLaunchers = {
  bs_chrome: {
    base: 'BrowserStack',
    browser: 'chrome',
    os: 'WINDOWS',
    os_version: '10'
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
  Chrome: {
    base: 'Chrome',
    flags: [
			// Without a remote debugging port, Google Chrome exits immediately.
			'--remote-debugging-port=9333'
		]
  }
};

module.exports = function(config) {
  config.set({
    plugins: [
      'karma-chrome-launcher',
      // 'karma-sauce-launcher',
      // 'karma-browserstack-launcher',
      'karma-jasmine',
      'karma-typescript'
    ],
    /*
    browsers: sauceLabs
      ? Object.keys(sauceLabsLaunchers)
      : Object.keys(localLaunchers),
    */
    // browsers: Object.keys(browserStackLaunchers),
    browsers: Object.keys(localLaunchers),

    singleRun: true, // set this to false to leave the browser open

    frameworks: ['jasmine', 'karma-typescript'],

    preprocessors: {
      "**/*.ts": "karma-typescript"
    },

    // customLaunchers: sauceLabs ? sauceLabsLaunchers : localLaunchers,
    // customLaunchers: browserStackLaunchers,

    files: [
      'src/**/*.spec.ts',
      'src/util.ts',
      'www/build/app.js',
      { pattern: 'www/build/app/*.js', watched: false, included: false, served: true, nocache: false },
      { pattern: 'www/**/*.html', watched: false, included: false, served: true, nocache: false },
    ],

    colors: true,

    logLevel: config.LOG_INFO,

    proxies: {
      '/www/app/*.js': '/base/www/app/*.js',
      '/www/**/*.html': '/base/www/**/*.html'
    },

    reporters: [
      'progress',
      // 'BrowserStack'
      // 'saucelabs'
    ],

    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json"
    },
  });
};
