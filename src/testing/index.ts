
export { createJestPuppeteerEnvironment } from './jest/jest-environment';
export { E2EElement, E2EPage } from './puppeteer/puppeteer-declarations';
export { h } from '../renderer/vdom/h';
export { jestPreprocessor } from './jest/jest-preprocessor';
export { jestSetupTestFramework } from './jest/jest-setup-test';
export { newE2EPage } from './puppeteer/puppeteer-page';
export { Testing } from './testing';
export { transpile } from './test-transpile';
import { MockWindow } from '@stencil/core/mock-doc';



let hasLogged = false;
// DEPRECATED 2018-08-31

/**
 * DEPRECATED: Please use MockWindow instead.
 */
export class TestWindow extends MockWindow {

  /**
   * DEPRECATED: Please use MockWindow instead.
   */
  get document() {
    if (!hasLogged) {
      console.log(`Unit testing with "TestWindow" from @stencil/core/testing has been deprecated and replaced with "MockWindow". For more info please see: https://stenciljs.com/docs/unit-testing`);
      hasLogged = true;
    }
    return super.document;
  }

  /**
   * DEPRECATED: Please see https://stenciljs.com/docs/e2e-testing
   */
  load() {
    throw new Error(`End-to-End testing with "TestWindow.load()" has been replaced by Stencil's End-to-End Testing Library, which uses Puppeteer (Headless Chrome Node API). For more info please see: https://stenciljs.com/docs/e2e-testing`);
  }
}
