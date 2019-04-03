const path = require('path');


module.exports = {
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json'
  ],
  moduleNameMapper: {
    "@stencil/core/app": "<rootDir>/dist/testing/platform",
    "@stencil/core/build-conditionals": "<rootDir>/dist/testing/build-conditionals",
    "@stencil/core/mock-doc": "<rootDir>/dist/mock-doc",
    "@stencil/core/platform": "<rootDir>/dist/testing/platform",
    "@stencil/core/sys": "<rootDir>/dist/sys/node",
    "@stencil/core/testing": "<rootDir>/dist/testing",
    "@stencil/core/utils": "<rootDir>/dist/utils",
    "@stencil/core": "<rootDir>/dist/testing/core"
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
