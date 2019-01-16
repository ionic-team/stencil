
export { BUILD, resetBuildConditionals } from './testing-build';
export { Component, Element, Event, Listen, Method, State, Watch } from './testing-decorators';
export { createJestPuppeteerEnvironment } from './jest/jest-environment';
export { createTestRunner } from './jest/jest-runner';
export { E2EElement, E2EPage } from './puppeteer/puppeteer-declarations';
export { jestPreprocessor } from './jest/jest-preprocessor';
export { jestSetupTestFramework } from './jest/jest-setup-test-framework';
export { mockDocument, mockWindow } from '@stencil/core/mock-doc';
export { newE2EPage } from './puppeteer/puppeteer-page';
export { newSpecPage } from './testing-spec-page';
export { Testing } from './testing';
export { transpile } from './test-transpile';
export * from './testing-platform';
