import type { E2EProcessEnv, JestEnvironmentGlobal } from '@stencil/core/internal';
import { connectBrowser, disconnectBrowser, newBrowserPage } from '../puppeteer/puppeteer-browser';

export function createJestPuppeteerEnvironment() {
  const NodeEnvironment = require('jest-environment-node');
  const JestEnvironment = class extends (NodeEnvironment as any) {
    global: JestEnvironmentGlobal;
    browser: any = null;
    pages: any[] = [];

    constructor(config: any) {
      super(config);
    }

    async setup() {
      if ((process.env as E2EProcessEnv).__STENCIL_E2E_TESTS__ === 'true') {
        this.global.__NEW_TEST_PAGE__ = this.newPuppeteerPage.bind(this);
        this.global.__CLOSE_OPEN_PAGES__ = this.closeOpenPages.bind(this);
      }
    }

    async newPuppeteerPage() {
      if (!this.browser) {
        // load the browser and page on demand
        this.browser = await connectBrowser();
      }

      const page = await newBrowserPage(this.browser);
      this.pages.push(page);
      const env: E2EProcessEnv = process.env;
      if (typeof env.__STENCIL_DEFAULT_TIMEOUT__ === 'string') {
        page.setDefaultTimeout(parseInt(env.__STENCIL_DEFAULT_TIMEOUT__, 10));
      }
      return page;
    }

    async closeOpenPages() {
      await Promise.all(this.pages.map((page) => page.close()));
      this.pages.length = 0;
    }

    async teardown() {
      await super.teardown();
      await this.closeOpenPages();
      await disconnectBrowser(this.browser);
      this.browser = null;
    }
  };

  return JestEnvironment;
}
