import * as d from '../../declarations';
import { connectBrowser, disconnectBrowser, newBrowserPage } from '../puppeteer/puppeteer-browser';


export function createJestPuppeteerEnvironment() {

  const jestEnvNodeModulePath = (process.env as d.E2EProcessEnv).__STENCIL_JEST_ENVIRONMENT_NODE_MODULE__ || 'jest-environment-node';
  const NodeEnvironment = require(jestEnvNodeModulePath);


  const JestEnvironment = class extends NodeEnvironment {
    global: d.JestEnvironmentGlobal;
    browser: any = null;
    pages: any[] = [];


    constructor(config: any) {
      super(config);
    }

    async setup() {
      if ((process.env as d.E2EProcessEnv).__STENCIL_E2E_TESTS__ === 'true') {
        this.global.__NEW_TEST_PAGE__ = this.newPuppeteerPage.bind(this);
      }
    }

    async newPuppeteerPage() {
      if (!this.browser) {
        // load the browser and page on demand
        this.browser = await connectBrowser();
      }

      if (!this.browser) {
        return null;
      }

      const page = await newBrowserPage(this.browser);

      this.pages.push(page);

      return page;
    }

    async teardown() {
      await super.teardown();

      await disconnectBrowser(this.browser, this.pages);

      this.pages.length = 0;

      this.browser = null;
    }

  };


  return JestEnvironment;
}
