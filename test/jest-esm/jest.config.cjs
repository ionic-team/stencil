/**
 * Jest config for running jest directly (using `node jest -c .../jest.config.js`, not using `node stencil test`).
 * This approach can be used when stencil component tests are used alongside other framework tests, eg
 * using [Jest projects]{@link https://jestjs.io/docs/configuration#projects-arraystring--projectconfig}.
 */

module.exports = {
  displayName: 'Jest tests using ESM',
  preset: '../../testing/jest-preset.js',
  globals: {
    stencil: {
      testing: {
        useESModules: true
      }
    }
  },
  moduleDirectories: [
    '../../node_modules'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
};
