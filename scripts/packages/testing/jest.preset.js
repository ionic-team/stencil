const path = require('path');


module.exports = {
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json'
  ],
  moduleNameMapper: {
    "@build-conditionals": "<rootDir>/dist/testing/",
    "@mock-doc": "<rootDir>/dist/mock-doc/",
    "@platform": "<rootDir>/dist/testing/",
    "@vdom": "<rootDir>/dist/renderer/vdom/",
    "@runtime": "<rootDir>/dist/runtime/",
    "@stencil/core/testing": "<rootDir>/dist/testing/",
    "@utils": "<rootDir>/dist/utils/",
    "@stencil/core": "<rootDir>/dist/testing/"
  },
  setupTestFrameworkScriptFile: path.join(__dirname, 'jest.setuptestframework.js'),
  testEnvironment: path.join(__dirname, 'jest.environment.js'),
  testPathIgnorePatterns: [
    '/.stencil',
    '/dist',
    '/node_modules',
    '/www'
  ],
  testRegex: '/src/.*\\.spec\\.(ts|tsx|js)$',
  transform: {
    '^.+\\.(ts|tsx)$': path.join(__dirname, 'jest.preprocessor.js')
  }
};
