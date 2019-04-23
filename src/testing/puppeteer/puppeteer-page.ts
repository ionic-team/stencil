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
    console.error(`newE2EPage() is only available from E2E tests, and ran with the --e2e cmd line flag.`);
    return failedPage();
  }

  try {
    const page: pd.E2EPageInternal = await global.__NEW_TEST_PAGE__();

    page._e2eElements = [];

    page._e2eGoto = page.goto;

    await setPageEmulate(page as any);

    await page.setCacheEnabled(false);

    await initPageEvents(page);

    initPageScreenshot(page);

    let docPromise: Promise<puppeteer.JSHandle> = null;

    page.find = async (selector: pd.FindSelector) => {
      if (!docPromise) {
        docPromise = page.evaluateHandle('document');
      }
      const documentJsHandle = await docPromise;
      const docHandle = documentJsHandle.asElement();
      return find(page, docHandle, selector) as any;
    };

    page.findAll = async (selector: pd.FindSelector) => {
      if (!docPromise) {
        docPromise = page.evaluateHandle('document');
      }
      const documentJsHandle = await docPromise;
      const docHandle = documentJsHandle.asElement();
      return findAll(page, docHandle, selector) as any;
    };

    page.waitForChanges = waitForChanges.bind(null, page);

    page.on('console', consoleMessage);
    page.on('pageerror', pageError);
    page.on('requestfailed', requestFailed);

    if (typeof opts.html === 'string') {
      const errMsg = await e2eSetContent(page, opts.html);
      if (errMsg) {
        throw errMsg;
      }

    } else if (typeof opts.url === 'string') {
      const errMsg = await e2eGoTo(page, opts.url);
      if (errMsg) {
        throw errMsg;
      }

    } else {
      page.goto = e2eGoTo.bind(null, page);
      page.setContent = e2eSetContent.bind(null, page);
    }

    return page;

  } catch (e) {
    console.error(e);
  }

  return failedPage();
}

function failedPage() {
  const page: pd.E2EPageInternal = {
    isClosed: () => true,
    setContent: () => Promise.resolve(),
    waitForChanges: () => Promise.resolve(),
    find: () => Promise.resolve(null)
  } as any;
  return page;
}

async function e2eGoTo(page: pd.E2EPageInternal, url: string) {
  try {
    if (page.isClosed()) {
      return 'e2eGoTo unavailable: page already closed';
    }
  } catch (e) {
    return null;
  }

  if (typeof url !== 'string') {
    await closePage(page);
    return 'invalid gotoTest() url';
  }

  if (!url.startsWith('/')) {
    await closePage(page);
    return 'gotoTest() url must start with /';
  }

  const browserUrl = (process.env as d.E2EProcessEnv).__STENCIL_BROWSER_URL__;
  if (typeof browserUrl !== 'string') {
    await closePage(page);
    return 'invalid gotoTest() browser url';
  }

  const fullUrl = browserUrl + url.substring(1);

  const rsp = await page._e2eGoto(fullUrl);

  if (!rsp.ok()) {
    await closePage(page);
    return `Testing unable to load ${url}, HTTP status: ${rsp.status()}`;
  }

  const tmr = setTimeout(async () => {
    await closePage(page);
    throw new Error(`App did not load in allowed time. Please ensure the url ${url} loads a stencil application.`);
  }, 4500);

  await page.waitForFunction('window.stencilAppLoaded');

  clearTimeout(tmr);

  return null;
}


async function e2eSetContent(page: pd.E2EPageInternal, html: string) {
  try {
    if (page.isClosed()) {
      return 'e2eSetContent unavailable: page already closed';
    }
  } catch (e) {
    return null;
  }

  if (typeof html !== 'string') {
    await closePage(page);
    return 'invalid e2eSetContent() html';
  }

  const appUrl = (process.env as d.E2EProcessEnv).__STENCIL_APP_URL__;
  if (typeof appUrl !== 'string') {
    await closePage(page);
    return 'invalid e2eSetContent() app script url';
  }

  const url = (process.env as d.E2EProcessEnv).__STENCIL_BROWSER_URL__;
  const body = [
    `<script type="module" src="${appUrl}"></script>`,
    html
  ].join('\n');

  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (url === interceptedRequest.url()) {
      interceptedRequest.respond({
        status: 200,
        contentType: 'text/html',
        body: body
      });

    } else {
      interceptedRequest.continue();
    }
  });

  const rsp = await page._e2eGoto(url);

  if (!rsp.ok()) {
    await closePage(page);
    return `Testing unable to load content`;
  }

  const tmr = setTimeout(async () => {
    await closePage(page);
    throw new Error(`App did not load in allowed time. Please ensure the content loads a stencil application.`);
  }, 4500);

  await page.waitForFunction('window.stencilAppLoaded');

  clearTimeout(tmr);

  return null;
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

    await Promise.all(page._e2eElements.map(elm => elm.e2eRunActions()));

    if (page.isClosed()) {
      return;
    }

    await page.evaluate(() => {
      // BROWSER CONTEXT
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          const promises: Promise<any>[] = [];

          const waitComponentOnReady = (elm: Element, promises: Promise<any>[]) => {
            if (elm != null) {
              const children = elm.children;
              const len = children.length;
              for (let i = 0; i < len; i++) {
                const childElm = children[i];
                if (childElm != null) {
                  if (childElm.tagName.includes('-') && typeof (childElm as d.HostElement).componentOnReady === 'function') {
                    promises.push((childElm as d.HostElement).componentOnReady());
                  }
                  waitComponentOnReady(childElm, promises);
                }
              }
            }
          };

          waitComponentOnReady(document.documentElement, promises);

          Promise.all(promises)
            .then(() => {
              resolve();
            })
            .catch(() => {
              resolve();
            });
        });
      });
    });

    if (page.isClosed()) {
      return;
    }

    await page.waitFor(100);

    await Promise.all(page._e2eElements.map(elm => elm.e2eSync()));

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
