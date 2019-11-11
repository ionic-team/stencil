import * as d from '../../declarations';
import * as pd from './puppeteer-declarations';
import { find, findAll } from './puppeteer-find';
import { initPageEvents, waitForEvent } from './puppeteer-events';
import { initPageScreenshot } from './puppeteer-screenshot';
import * as puppeteer from 'puppeteer';


declare const global: d.JestEnvironmentGlobal;


const env: d.E2EProcessEnv = process.env;
export async function newE2EPage(opts: pd.NewE2EPageOptions = {}): Promise<pd.E2EPage> {
  if (!global.__NEW_TEST_PAGE__) {
    throw new Error(`newE2EPage() is only available from E2E tests, and ran with the --e2e cmd line flag.`);
  }

  const page: pd.E2EPageInternal = await global.__NEW_TEST_PAGE__();
  const diagnostics: pd.PageDiagnostic[] = [];
  try {
    page._e2eElements = [];

    page._e2eGoto = page.goto;
    page._e2eClose = page.close;

    await setPageEmulate(page as any);
    await page.setCacheEnabled(false);
    await initPageEvents(page);

    initPageScreenshot(page);

    let docPromise: Promise<puppeteer.JSHandle> = null;

    page.close = async (options?: puppeteer.PageCloseOptions) => {
      try {
        if (Array.isArray(page._e2eElements)) {
          const disposes = page._e2eElements.map(async elmHande => {
            if (typeof elmHande.e2eDispose === 'function') {
              await elmHande.e2eDispose();
            }
          });
          await Promise.all(disposes);
        }
      } catch (e) {}

      const noop: any = () => { throw new Error('The page was already closed'); };
      page._e2eElements = noop;
      page._e2eEvents = noop;
      page._e2eGoto = noop;
      page.find = noop;
      page.debugger = noop;
      page.findAll = noop;
      page.compareScreenshot = noop;
      page.setContent = noop;
      page.spyOnEvent = noop;
      page.waitForChanges = noop;
      page.waitForEvent = noop;

      try {
        if (!page.isClosed()) {
          await page._e2eClose(options);
        }
      } catch (e) {}
    };

    const getDocHandle = async () => {
      if (!docPromise) {
        docPromise = page.evaluateHandle(() => document);
      }
      const documentJsHandle = await docPromise;
      return documentJsHandle.asElement();
    };

    page.find = async (selector: pd.FindSelector) => {
      const docHandle = await getDocHandle();
      return find(page, docHandle, selector) as any;
    };

    page.findAll = async (selector: pd.FindSelector) => {
      const docHandle = await getDocHandle();
      return findAll(page, docHandle, selector) as any;
    };

    page.waitForEvent = async (eventName) => {
      const docHandle = await getDocHandle();
      return waitForEvent(page, eventName, docHandle);
    };

    page.getDiagnostics = () => {
      return diagnostics;
    };

    page.waitForChanges = waitForChanges.bind(null, page);

    page.debugger = () => {
      if (env.__STENCIL_E2E_DEVTOOLS__ !== 'true') {
        throw new Error('Set the --devtools flag in order to use E2EPage.debugger()');
      }
      return page.evaluate(() => {
        return new Promise((resolve) => {
          // tslint:disable-next-line: no-debugger
          debugger;
          resolve();
        });
      }) as any;
    };

    const failOnConsoleError = opts.failOnConsoleError === true;
    const failOnNetworkError = opts.failOnNetworkError === true;

    page.on('console', (ev) => {
      if (ev.type() === 'error') {
        diagnostics.push({
          type: 'error',
          message: ev.text(),
          location: ev.location().url
        });
        if (failOnConsoleError) {
          fail(new Error(serializeConsoleMessage(ev)));
          return;
        }
      }
      consoleMessage(ev);
    });
    page.on('pageerror', (err: Error) => {
      diagnostics.push({
        type: 'pageerror',
        message: err.message,
        location: err.stack
      });
      fail(err);
    });
    page.on('requestfailed', (req) => {
      diagnostics.push({
        type: 'requestfailed',
        message: req.failure().errorText,
        location: req.url()
      });
      if (failOnNetworkError) {
        fail(new Error(req.failure().errorText));
        return;
      }
      console.error('requestfailed', req.url());
    });

    if (typeof opts.html === 'string') {
      await e2eSetContent(page, opts.html, { waitUntil: opts.waitUntil });

    } else if (typeof opts.url === 'string') {
      await e2eGoTo(page, opts.url, { waitUntil: opts.waitUntil });

    } else {
      page.goto = e2eGoTo.bind(null, page);
      page.setContent = e2eSetContent.bind(null, page);
    }

  } catch (e) {
    if (page) {
      page.close();
    }
    throw e;
  }
  return page;
}

async function e2eGoTo(page: pd.E2EPageInternal, url: string, options: puppeteer.NavigationOptions = {}) {

  if (page.isClosed()) {
    throw new Error('e2eGoTo unavailable: page already closed');
  }

  if (typeof url !== 'string') {
    throw new Error('invalid gotoTest() url');
  }

  if (!url.startsWith('/')) {
    throw new Error('gotoTest() url must start with /');
  }

  const browserUrl = env.__STENCIL_BROWSER_URL__;
  if (typeof browserUrl !== 'string') {
    throw new Error('invalid gotoTest() browser url');
  }

  const fullUrl = browserUrl + url.substring(1);

  if (!options.waitUntil) {
    options.waitUntil = env.__STENCIL_BROWSER_WAIT_UNTIL as any;
  }
  const rsp = await page._e2eGoto(fullUrl, options);

  if (!rsp.ok()) {
    throw new Error(`Testing unable to load ${url}, HTTP status: ${rsp.status()}`);
  }

  await waitForStencil(page);

  return rsp;
}


async function e2eSetContent(page: pd.E2EPageInternal, html: string, options: puppeteer.NavigationOptions = {}) {
  if (page.isClosed()) {
    throw new Error('e2eSetContent unavailable: page already closed');
  }

  if (typeof html !== 'string') {
    throw new Error('invalid e2eSetContent() html');
  }

  const appUrl = env.__STENCIL_APP_URL__;
  if (typeof appUrl !== 'string') {
    throw new Error('invalid e2eSetContent() app script url');
  }

  const url = env.__STENCIL_BROWSER_URL__;
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
      (page as any).removeAllListeners('request');
      page.setRequestInterception(false);

    } else {
      interceptedRequest.continue();
    }
  });

  if (!options.waitUntil) {
    options.waitUntil = env.__STENCIL_BROWSER_WAIT_UNTIL as any;
  }
  const rsp = await page._e2eGoto(url, options);

  if (!rsp.ok()) {
    throw new Error(`Testing unable to load content`);
  }

  await waitForStencil(page);

  return rsp;
}


async function waitForStencil(page: pd.E2EPage) {
  try {
    await page.waitForFunction('window.stencilAppLoaded', {timeout: 4500});

  } catch (e) {
    throw new Error(`App did not load in allowed time. Please ensure the content loads a stencil application.`);
  }
}


async function setPageEmulate(page: puppeteer.Page) {
  if (page.isClosed()) {
    return;
  }

  const emulateJsonContent = env.__STENCIL_EMULATE__;
  if (!emulateJsonContent) {
    return;
  }

  const screenshotEmulate = JSON.parse(emulateJsonContent) as d.EmulateConfig;

  const emulateOptions: puppeteer.EmulateOptions = {
    viewport: screenshotEmulate.viewport,
    userAgent: screenshotEmulate.userAgent
  };

  await (page as puppeteer.Page).emulate(emulateOptions);
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
  const message = serializeConsoleMessage(c);
  if (message.includes('STENCIL-DEV-MODE')) {
    return;
  }
  const type = c.type();
  const normalizedType = type === 'warning' ? 'warn' : type;
  if (typeof (console as any)[normalizedType] === 'function') {
    (console as any)[normalizedType](message);
  } else {
    console.log(type, message);
  }
}

function serializeConsoleMessage(c: puppeteer.ConsoleMessage) {
  return `${c.text()} ${serializeLocation(c.location())}`;
}

function serializeLocation(loc: puppeteer.ConsoleMessageLocation) {
  let locStr = '';
  if (loc && loc.url) {
    locStr = `\nLocation: ${loc.url}`;
    if (loc.lineNumber) {
      locStr += `:${loc.lineNumber}`;
    }
    if (loc.columnNumber) {
      locStr += `:${loc.columnNumber}`;
    }
  }
  return locStr;
}


