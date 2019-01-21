const path = require('path');


module.exports = {
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json'
  ],
  moduleNameMapper: {
    "@stencil/core/build-conditionals": "<rootDir>/dist/testing",
    "@stencil/core/mock-doc": "<rootDir>/dist/mock-doc",
    "@stencil/core/platform": "<rootDir>/dist/testing",
    "@stencil/core/runtime": "<rootDir>/dist/runtime",
    "@stencil/core/testing": "<rootDir>/dist/testing",
    "@stencil/core/utils": "<rootDir>/dist/utils",
    "@stencil/core": "<rootDir>/dist/testing"
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
