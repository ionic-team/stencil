/**
 * @license
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var path = require('path');
process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
  config.set({
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-typescript'
    ],

    browsers: ['ChromeHeadless'], // run in Chrome and Firefox

    singleRun: true, // set this to false to leave the browser open
    frameworks: ['jasmine', 'karma-typescript'],

    preprocessors: {
      "**/*.ts": "karma-typescript"
    },

    files: [
      '**/e2e.ts',
      { pattern: 'dist/app/*.js', watched: false, included: false, served: true, nocache: false },
      'dist/app.js',
    ],

    proxies: {
      '/dist/app/*.js': '/base/dist/app/*.js'
    },

    reporters: ['progress'],
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json"
    },
  });
};
