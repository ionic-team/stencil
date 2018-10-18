import * as d from '../../declarations';
import * as pd from './puppeteer-declarations';
import { closePage } from './puppeteer-browser';
import { find, findAll } from './puppeteer-find';
import { initPageEvents } from './puppeteer-events';
import { initPageScreenshot } from './puppeteer-screenshot';
import * as puppeteer from 'puppeteer';


declare const global: d.JestEnvironmentGlobal;


export async function newE2EPage(opts: pd.NewE2EPageOptions = {}): Promise<pd.E2EPage> {
  if (!global.__NEW_TEST_PAGE__) {
    throw new Error(`newE2EPage() is only available from E2E tests, and ran with the --e2e cmd line flag.`);
  }

  const page: pd.E2EPageInternal = await global.__NEW_TEST_PAGE__();

  page._e2eElements = [];

  page._e2eGoto = page.goto;

  await setPageEmulate(page as any);

  await page.setCacheEnabled(false);

  await initPageEvents(page);

  initPageScreenshot(page);

  let docPromise: Promise<puppeteer.JSHandle> = null;

  page.find = async (selector: string) => {
    if (!docPromise) {
      docPromise = page.evaluateHandle('document');
    }
    const documentJsHandle = await docPromise;
    const docHandle = documentJsHandle.asElement();
    return find(page, docHandle, selector);
  };

  page.findAll = async (selector: string) => {
    if (!docPromise) {
      docPromise = page.evaluateHandle('document');
    }
    const documentJsHandle = await docPromise;
    const docHandle = documentJsHandle.asElement();
    return findAll(page, docHandle, selector);
  };

  page.waitForChanges = waitForChanges.bind(null, page);

  page.on('console', consoleMessage);
  page.on('pageerror', pageError);
  page.on('requestfailed', requestFailed);

  if (typeof opts.html === 'string') {
    await e2eSetContent(page, opts.html);

  } else if (typeof opts.url === 'string') {
    await e2eGoTo(page, opts.url);

  } else {
    page.goto = e2eGoTo.bind(null, page);
    page.setContent = e2eSetContent.bind(null, page);
  }

  return page;
}


async function e2eGoTo(page: pd.E2EPageInternal, url: string) {
  try {
    if (page.isClosed()) {
      console.error('e2eGoTo unavailable: page already closed');
      return;
    }
  } catch (e) {
    return;
  }

  if (typeof url !== 'string') {
    console.error('invalid gotoTest() url');
    await closePage(page);
    return;
  }

  if (!url.startsWith('/')) {
    console.error('gotoTest() url must start with /');
    await closePage(page);
    return;
  }

  const browserUrl = (process.env as d.E2EProcessEnv).__STENCIL_BROWSER_URL__;
  if (typeof browserUrl !== 'string') {
    console.error('invalid gotoTest() browser url');
    await closePage(page);
    return;
  }

  // resolves once the stencil app has finished loading
  const appLoaded = page.waitForFunction('window.stencilAppLoaded');

  const fullUrl = browserUrl + url.substring(1);

  let timedOut = false;
  try {
    await page._e2eGoto(fullUrl, {
      waitUntil: 'load'
    });

    const tmr = setTimeout(async () => {
      timedOut = true;
      console.error(`App did not load in allowed time. Please ensure the url ${url} loads a stencil application.`);
      await closePage(page);
    }, 4500);

    await appLoaded;

    clearTimeout(tmr);

  } catch (e) {
    if (!timedOut) {
      console.error(`error goto: ${url}, ${e}`);
      await closePage(page);
    }
  }
}


async function e2eSetContent(page: pd.E2EPageInternal, html: string) {
  try {
    if (page.isClosed()) {
      console.error('e2eSetContent unavailable: page already closed');
      return;
    }
  } catch (e) {
    return;
  }

  if (typeof html !== 'string') {
    console.error('invalid e2eSetContent() html');
    await closePage(page);
    return;
  }

  const loaderUrl = (process.env as d.E2EProcessEnv).__STENCIL_LOADER_URL__;
  if (typeof loaderUrl !== 'string') {
    console.error('invalid e2eSetContent() loader script url');
    await closePage(page);
    return;
  }

  const url = [
    `data:text/html;charset=UTF-8,`,
    `<script src="${loaderUrl}"></script>`,
    html
  ];

  try {
    // resolves once the stencil app has finished loading
    const appLoaded = page.waitForFunction('window.stencilAppLoaded');

    await page._e2eGoto(url.join(''), {
      waitUntil: 'load'
    });

    await appLoaded;

  } catch (e) {
    console.error(`e2eSetContent: ${e}`);
    await closePage(page);
  }
}


async function setPageEmulate(page: puppeteer.Page) {
  try {
    if (page.isClosed()) {
      return;
    }
  } catch (e) {
    return;
  }

  const env = (process.env) as d.E2EProcessEnv;

  const emulateJsonContent = env.__STENCIL_EMULATE__;
  if (!emulateJsonContent) {
    return;
  }

  try {
    const screenshotEmulate = JSON.parse(emulateJsonContent) as d.EmulateConfig;

    const emulateOptions: puppeteer.EmulateOptions = {
      viewport: screenshotEmulate.viewport,
      userAgent: screenshotEmulate.userAgent
    };

    await (page as puppeteer.Page).emulate(emulateOptions);

  } catch (e) {
    console.error('setPageEmulate', e);
    await closePage(page);
  }
}


async function waitForChanges(page: pd.E2EPageInternal) {
  try {
    if (page.isClosed()) {
      return;
    }

    await Promise.all(page._e2eElements.map(async elm => {
      await elm.e2eRunActions();
    }));

    if (page.isClosed()) {
      return;
    }

    await page.evaluate(() => {

      const promises = (window as d.WindowData)['s-apps'].map((appNamespace: string) => {
        return (window as any)[appNamespace].onReady();
      });

      return Promise.all(promises);
    });

    if (page.isClosed()) {
      return;
    }

    await Promise.all(page._e2eElements.map(async elm => {
      await elm.e2eSync();
    }));

    await page.waitFor(4);

  } catch (e) {}
}


function consoleMessage(c: puppeteer.ConsoleMessage) {
  const type = c.type();
  if (typeof (console as any)[type] === 'function') {
    (console as any)[type](c.text());
  } else {
    console.log(type, c.text());
  }
}


function pageError(e: any) {
  console.error('pageerror', e);
}


function requestFailed(req: puppeteer.Request) {
  console.error('requestfailed', req.url());
}
