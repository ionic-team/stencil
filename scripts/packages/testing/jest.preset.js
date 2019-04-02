const path = require('path');


module.exports = {
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json'
  ],
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
