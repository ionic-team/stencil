import NodeEnvironment from 'jest-environment-node';
import { connectBrowser, disconnectBrowser, newBrowserPage } from '../../puppeteer/puppeteer-browser';
export function createJestPuppeteerEnvironment() {
    const JestEnvironment = class extends NodeEnvironment {
        constructor(config) {
            super(config);
            this.browser = null;
            this.pages = [];
        }
        async setup() {
            if (process.env.__STENCIL_E2E_TESTS__ === 'true') {
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
            // during E2E tests, we can safely assume that the current environment is a `E2EProcessEnv`
            const env = process.env;
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
        getVmContext() {
            return super.getVmContext();
        }
    };
    return JestEnvironment;
}
//# sourceMappingURL=jest-environment.js.map