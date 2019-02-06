
export { createJestPuppeteerEnvironment } from './jest/jest-environment';
export { createTestRunner } from './jest/jest-runner';
export { E2EElement, E2EPage } from './puppeteer/puppeteer-declarations';
export { jestPreprocessor } from './jest/jest-preprocessor';
export { jestSetupTestFramework } from './jest/jest-setup-test-framework';
export { newE2EPage } from './puppeteer/puppeteer-page';
export { newSpecPage } from './testing-spec-page';
export { shuffleArray } from './shuffle-array';
export { Testing } from './testing';
export { transpile } from './test-transpile';
export * from './mocks';

import { applyPolyfills } from '../cli/polyfills';
applyPolyfills();
