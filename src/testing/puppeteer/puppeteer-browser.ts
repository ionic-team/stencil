import * as d from '../../declarations';
import * as pd from './puppeteer-declarations';
import * as puppeteer from 'puppeteer';


export async function startPuppeteerBrowser(config: d.Config) {
  if (!config.flags.e2e) {
    return null;
  }

  const env: d.E2EProcessEnv = process.env;

  const puppeteerModulePath = config.sys.lazyRequire.getModulePath('puppeteer');
  const puppeteer = require(puppeteerModulePath);
  env.__STENCIL_PUPPETEER_MODULE__ = puppeteerModulePath;

  if (config.flags.devtools) {
    config.testing.browserDevtools = true;
    config.testing.browserHeadless = false;
    env.__STENCIL_E2E_DEVTOOLS__ = 'true';
  }

  config.logger.debug(`puppeteer: ${puppeteerModulePath}`);
  config.logger.debug(`puppeteer headless: ${config.testing.browserHeadless}`);

  if (Array.isArray(config.testing.browserArgs)) {
    config.logger.debug(`puppeteer args: ${config.testing.browserArgs.join(' ')}`);
  }

  if (typeof config.testing.browserDevtools === 'boolean') {
    config.logger.debug(`puppeteer devtools: ${config.testing.browserDevtools}`);
  }

  if (typeof config.testing.browserSlowMo === 'number') {
    config.logger.debug(`puppeteer slowMo: ${config.testing.browserSlowMo}`);
  }

  const launchOpts: puppeteer.LaunchOptions = {
    ignoreHTTPSErrors: true,
    args: config.testing.browserArgs,
    headless: config.testing.browserHeadless,
    devtools: config.testing.browserDevtools,
    slowMo: config.testing.browserSlowMo
  };

  if (config.testing.browserExecutablePath) {
    launchOpts.executablePath = config.testing.browserExecutablePath;
  }

  const browser = (config.testing.browserWSEndpoint)
    ? await puppeteer.connect({
        ...launchOpts,
        browserWSEndpoint: config.testing.browserWSEndpoint
      })
    : await puppeteer.launch(launchOpts);

  env.__STENCIL_BROWSER_WS_ENDPOINT__ = browser.wsEndpoint();

  config.logger.debug(`puppeteer browser wsEndpoint: ${env.__STENCIL_BROWSER_WS_ENDPOINT__}`);

  return browser;
}


export async function connectBrowser() {
  // the reason we're connecting to the browser from
  // a web socket is because jest probably has us
  // in a different thread, this is also why this
  // uses process.env for data
  const env: d.E2EProcessEnv = process.env;

  const wsEndpoint = env.__STENCIL_BROWSER_WS_ENDPOINT__;
  if (!wsEndpoint) {
    return null;
  }

  const connectOpts: puppeteer.ConnectOptions = {
    browserWSEndpoint: wsEndpoint,
    ignoreHTTPSErrors: true
  };

  const puppeteer = require(env.__STENCIL_PUPPETEER_MODULE__);

  return await puppeteer.connect(connectOpts);
}


export async function disconnectBrowser(browser: puppeteer.Browser, pages: puppeteer.Page[]) {
  await closePages(pages);
  if (browser) {
    try {
      browser.disconnect();
    } catch (e) {}
  }
}

export async function closePages(pages: puppeteer.Page[]) {
  if (Array.isArray(pages)) {
    await Promise.all(pages.map(closePage));
    pages.length = 0;
  }
}


export function newBrowserPage(browserContext: puppeteer.BrowserContext) {
  return browserContext.newPage();
}


export async function closePage(page: any) {
  try {
    if (Array.isArray((page as pd.E2EPageInternal)._e2eElements)) {
      const disposes = (page as pd.E2EPageInternal)._e2eElements.map(async elmHande => {
        if (typeof elmHande.e2eDispose === 'function') {
          await elmHande.e2eDispose();
        }
      });
      await Promise.all(disposes);
    }
  } catch (e) {}

  (page as pd.E2EPageInternal)._e2eElements = null;
  (page as pd.E2EPageInternal)._e2eEvents = null;
  (page as pd.E2EPageInternal)._e2eGoto = null;
  (page as pd.E2EPageInternal).find = null;
  (page as pd.E2EPageInternal).findAll = null;
  (page as pd.E2EPageInternal).compareScreenshot = null;
  (page as pd.E2EPageInternal).setContent = null;
  (page as pd.E2EPageInternal).spyOnEvent = null;
  (page as pd.E2EPageInternal).waitForChanges = null;
  (page as pd.E2EPageInternal).waitForEvent = null;

  try {
    if (!(page as puppeteer.Page).isClosed()) {
      await (page as puppeteer.Page).close();
    }
  } catch (e) {}
}
