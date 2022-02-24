/**
 * Jest config for running jest directly (using `node jest -c .../jest.config.js`, not using `node stencil test`).
 * This approach can be used when stencil component tests are used alongside other framework tests, eg
 * using [Jest projects]{@link https://jestjs.io/docs/configuration#projects-arraystring--projectconfig}.
 */

module.exports = {
  displayName: 'Jest tests using ESM',
  // preset: '../../testing/jest-preset.js',
  // testRunner: 'jest-jasmine2',
  globals: {
    stencil: {
      testing: {
        useESModules: true
      }
    }
  },
  setupFilesAfterEnv: [
    '<rootDir>/../../testing/jest-setuptestframework.js'
  ],
  moduleDirectories: [
    '../../node_modules'
  ],
  moduleNameMapper: {
    '^@stencil/core/testing$': '<rootDir>/../../testing/index.js',
    '^@stencil/core$': '<rootDir>/../../internal/testing/index.js',
    '^@stencil/core/internal/app-data$': '<rootDir>/../../internal/app-data/index.cjs',
    '^@stencil/core/internal/app-globals$': '<rootDir>/../../internal/app-globals/index.js',
    '^@stencil/core/mock-doc$': '<rootDir>/../../mock-doc/index.cjs',
    '^@stencil/core/sys$': '<rootDir>/../../sys/node/index.js',
    '^@stencil/core$': '<rootDir>/../../internal/testing/index.js',
    '^@stencil/core/internal(.*)$': '<rootDir>/../../internal$1'
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
  transform: {
    '^.+\\.(ts|tsx|jsx|css)$': '../../testing/jest-preprocessor.js'
  },
};
