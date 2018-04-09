import * as d from '../declarations';
import { fillCmpMetaFromConstructor } from '../server/cmp-meta';
import { mockStencilSystem } from './mocks';
import { Renderer } from '../server';
import { TestWindowLogger } from './test-window-logger';
import { validateConfig } from '../compiler/config/validate-config';


// weakmaps to keep these actually private
const loggers = new WeakMap<TestWindow, TestWindowLogger>();
const platforms = new WeakMap<TestWindow, d.PlatformApi>();


export class TestWindow {

  async load(opts: TestWindowLoadOptions) {
    if (this.window) {
      throw new Error(`TestWindow load() cannot be called more than once on the same instance`);
    }

    // validate we've got good options
    validateTestWindowLoadOptions(opts);

    // only create one dom per TestWindow
    const sys = mockStencilSystem();
    const dom = sys.createDom();

    // all subsequent calls reuse the same DOM for this test window
    // for example, the hydrateHtml fn in Renderer end up using this
    // same one rather than creating a new dom entirely
    sys.createDom = () => dom;

    const logger = new TestWindowLogger();
    loggers.set(this, logger);

    const config = validateConfig({
      sys: sys,
      logger: logger,
      rootDir: '/',
      devMode: true,
      _isTesting: true
    } as d.Config);

    let elm: any = null;

    try {
      const compilerCtx: d.CompilerCtx = {};
      const registry: d.ComponentRegistry = {};

      opts.components.forEach((testCmp: d.ComponentConstructor) => {
        if (testCmp) {
          const cmpMeta = fillCmpMetaFromConstructor(testCmp, {});
          registry[cmpMeta.tagNameMeta] = cmpMeta;
        }
      });

      const renderer = new Renderer(config, registry, compilerCtx);

      const hydrateOpts: d.HydrateOptions = {
        html: opts.html,
        url: opts.url,
        userAgent: opts.userAgent,
        cookie: opts.cookie,
        direction: opts.direction,
        language: opts.language,
        serializeHtml: false,
        destroyDom: false,
        isPrerender: false,
        inlineLoaderScript: false,
        inlineStyles: false,
        removeUnusedStyles: false,
        canonicalLink: false,
        collapseWhitespace: false,
        ssrIds: false
      };

      const results = await renderer.hydrate(hydrateOpts);

      if (results.diagnostics.length) {
        const msg = results.diagnostics.map(d => d.messageText).join('\n');
        throw new Error(msg);
      }

      elm = (results.root && results.root.children.length > 1 && results.root.children[1].firstElementChild) || null;
      if (elm) {
        // trick to get the private platform (shhh)
        platforms.set(this, (results as any).__testPlatform);
        delete (results as any).__testPlatform;

        // get the window from the element just created
        const window = elm.ownerDocument.defaultView as any;

        // copy over all the dom window properties
        Object.keys(window).forEach(key => {
          (this as any)[key] = window[key];
        });
      }

    } catch (e) {
      logger.error(e);
    }

    logger.printLogs();

    return elm;
  }


  async flush() {
    const plt = platforms.get(this);
    await plt.queue.flush();

    const logger = loggers.get(this);
    logger.printLogs();
  }


  // properties
  crypto: Crypto;
  document: Document;
  history: History;
  location: Location;
  navigator: Navigator;
  performance: Performance;
  window: Window;

  // methods
  getComputedStyle?(elt: Element, pseudoElt?: string | null): CSSStyleDeclaration;
  getMatchedCSSRules?(elt: Element, pseudoElt?: string | null): CSSRuleList;
  matchMedia?(mediaQuery: string): MediaQueryList;
  requestAnimationFrame?(callback: FrameRequestCallback): number;
  addEventListener?<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener?(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener?<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener?(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

  get Blob() {
    validateWindow(this, 'Blob');
    return this.window.Blob;
  }

  get CustomEvent() {
    validateWindow(this, 'CustomEvent');
    return (this.window as any).CustomEvent;
  }

  get Event() {
    validateWindow(this, 'Event');
    return (this.window as any).Event;
  }

  get URL() {
    validateWindow(this, 'URL');
    return this.window.URL;
  }

  get URLSearchParams() {
    validateWindow(this, 'URLSearchParams');
    return this.window.URLSearchParams;
  }

}


function validateWindow(testWindow: TestWindow, key: string) {
  if (!testWindow.window) {
    throw new Error(`TestWindow load() must be called before using "${key}"`);
  }
}


export interface TestWindowLoadOptions {
  components: any[];
  html: string;
  url?: string;
  userAgent?: string;
  cookie?: string;
  direction?: string;
  language?: string;
}


function validateTestWindowLoadOptions(opts: TestWindowLoadOptions) {
  if (!opts) {
    throw new Error('missing TestWindow load() options');
  }
  if (!opts.components) {
    throw new Error(`missing TestWindow load() components: ${opts}`);
  }
  if (!Array.isArray(opts.components)) {
    throw new Error(`TestWindow load() components must be an array: ${opts}`);
  }
  if (typeof opts.html !== 'string') {
    throw new Error(`TestWindow load() html must be a string: ${opts}`);
  }

  if (typeof opts.url !== 'string') {
    opts.url = 'http://testwindow.stenciljs.com/';
  }

  if (typeof opts.userAgent !== 'string') {
    opts.userAgent = 'testwindow';
  }
}
