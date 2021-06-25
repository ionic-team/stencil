import type { Config, E2EProcessEnv } from '@stencil/core/internal';
import type * as puppeteer from 'puppeteer';

export async function startPuppeteerBrowser(config: Config) {
  if (!config.flags.e2e) {
    return null;
  }

  const env: E2EProcessEnv = process.env;
  const puppeteerDep = config.testing.browserExecutablePath ? 'puppeteer-core' : 'puppeteer';

  const puppeteerModulePath = config.sys.lazyRequire.getModulePath(config.rootDir, puppeteerDep);
  const puppeteer = config.sys.lazyRequire.require(config.rootDir, puppeteerModulePath);
  env.__STENCIL_PUPPETEER_MODULE__ = puppeteerModulePath;
  env.__STENCIL_BROWSER_WAIT_UNTIL = config.testing.browserWaitUntil;

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

  // connection options will be used regardless whether a new browser instance is created or we attach to a
  // pre-existing instance
  const connectOpts: puppeteer.ConnectOptions = {
    ignoreHTTPSErrors: true,
    slowMo: config.testing.browserSlowMo,
  };

  let browser: puppeteer.Browser;
  if (config.testing.browserWSEndpoint) {
    browser = await puppeteer.connect({
      browserWSEndpoint: config.testing.browserWSEndpoint,
      ...connectOpts
    });
  } else {
    const launchOpts: puppeteer.BrowserLaunchArgumentOptions & puppeteer.LaunchOptions & puppeteer.ConnectOptions = {
      args: config.testing.browserArgs,
      headless: config.testing.browserHeadless,
      devtools: config.testing.browserDevtools,
      ...connectOpts,
    };
    if (config.testing.browserExecutablePath) {
      launchOpts.executablePath = config.testing.browserExecutablePath;
    }
    browser = await puppeteer.launch({ ...launchOpts });
  }

  env.__STENCIL_BROWSER_WS_ENDPOINT__ = browser.wsEndpoint();

  config.logger.debug(`puppeteer browser wsEndpoint: ${env.__STENCIL_BROWSER_WS_ENDPOINT__}`);

  return browser;
}

export async function connectBrowser() {
  // the reason we're connecting to the browser from
  // a web socket is because jest probably has us
  // in a different thread, this is also why this
  // uses process.env for data
  const env: E2EProcessEnv = process.env;

  const wsEndpoint = env.__STENCIL_BROWSER_WS_ENDPOINT__;
  if (!wsEndpoint) {
    return null;
  }

  const connectOpts: puppeteer.ConnectOptions = {
    browserWSEndpoint: wsEndpoint,
    ignoreHTTPSErrors: true,
  };

  const puppeteer = require(env.__STENCIL_PUPPETEER_MODULE__);

  return await puppeteer.connect(connectOpts);
}

export async function disconnectBrowser(browser: puppeteer.Browser) {
  if (browser) {
    try {
      browser.disconnect();
    } catch (e) {}
  }
}

export function newBrowserPage(browser: puppeteer.Browser) {
  return browser.newPage();
}
