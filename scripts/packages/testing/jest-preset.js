const path = require('path');
const testingDir = __dirname;
const rootDir = path.join(testingDir, '..');
const distDir = path.join(rootDir, 'dist');

module.exports = {
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json'
  ],
  moduleNameMapper: {
    "^@stencil/core/build-conditionals$": path.join(distDir, 'testing', 'build-conditionals'),
    "^@stencil/core/cli$": path.join(distDir, 'cli'),
    "^@stencil/core/compiler$": path.join(rootDir, 'compiler'),
    "^@stencil/core/internal$": path.join(rootDir, 'internal'),
    "^@stencil/core/mock-doc$": path.join(distDir, 'mock-doc'),
    "^@stencil/core/platform$": path.join(distDir, 'testing', 'platform'),
    "^@stencil/core/sys$": path.join(distDir, 'sys', 'node'),
    "^@stencil/core/testing$": path.join(distDir, 'testing'),
    "^@stencil/core/utils$": path.join(distDir, 'utils'),
    "^@stencil/core$": path.join(distDir, 'testing', 'core')
  },
  setupFilesAfterEnv: [path.join(testingDir, 'jest-setuptestframework.js')],
  testEnvironment: path.join(testingDir, 'jest-environment.js'),
  testPathIgnorePatterns: [
    '/.stencil',
    '/.vscode',
    '/dist',
    '/node_modules',
    '/www'
  ],
  maxConcurrency: 1,
  testRegex: '(/__tests__/.*|\\.?(test|spec))\\.(tsx?|ts?|jsx?|js?)$',
  transform: {
    '^.+\\.(ts|tsx|jsx)$': path.join(testingDir, 'jest-preprocessor.js')
  }
};
