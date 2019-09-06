export { SpecPage, EventSpy } from '../declarations';
export { createJestPuppeteerEnvironment } from './jest/jest-environment';
export { createTestRunner } from './jest/jest-runner';
export { E2EElement, E2EPage } from './puppeteer/puppeteer-declarations';
export { jestPreprocessor } from './jest/jest-preprocessor';
export { jestSetupTestFramework } from './jest/jest-setup-test-framework';
export { mockBuildCtx, mockConfig, mockCompilerCtx, mockDocument, mockFs, mockLogger, mockStencilSystem, mockWindow } from './mocks';
export { mockFetch } from './mock-fetch';
export { newE2EPage } from './puppeteer/puppeteer-page';
export { newSpecPage } from './spec-page';
export { shuffleArray } from './testing-utils';
export { Testing } from './testing';
export { transpile } from './test-transpile';


import { URL as nodeURL } from 'url';
if (typeof URL === 'undefined') {
  // polyfill global URL for Node version < 10.0.0
  (global as any).URL = nodeURL;
}
