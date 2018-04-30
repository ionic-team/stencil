import * as d from '../declarations';
import { fillCmpMetaFromConstructor } from '../util/cmp-meta';
import { mockStencilSystem } from './mocks';
import { Renderer } from '../server';
import { TestWindowLogger } from './test-window-logger';
import { validateConfig } from '../compiler/config/validate-config';


// weakmaps to keep these actually private
const loggers = new WeakMap<TestWindow, TestWindowLogger>();
const platforms = new WeakMap<TestWindow, d.PlatformApi>();


// Extern type definition of TestWindow to look like a subclass of Window
// while at runtime, it's not.
export declare interface TestWindow extends Window {}

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
        this.window = elm.ownerDocument.defaultView as any;
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


  window: Window;

  get document(): Document {
    return getWindowObj(this, 'document');
  }

  get history(): History {
    return getWindowObj(this, 'history');
  }

  get location(): Location {
    return getWindowObj(this, 'location');
  }

  get navigator(): Navigator {
    return getWindowObj(this, 'navigator');
  }

  get CustomEvent(): typeof CustomEvent {
    return getWindowObj(this, 'CustomEvent');
  }

  get Event(): typeof Event {
    return getWindowObj(this, 'Event');
  }

  get URL(): typeof URL {
    return getWindowObj(this, 'URL');
  }

}

// shared window which can be reused
let sharedWindow: any;

function getWindowObj(testWindow: TestWindow, key: string) {
  if (testWindow.window) {
    // we've already created the window for this TestWindow, use this one
    return (testWindow.window as any)[key];
  }

  if (!sharedWindow) {
    // we don't have a window created, so use the shared one
    // but first let's create the shared one (which could get reused)
    const opts: d.HydrateOptions = {
      url: DEFAULT_URL,
      userAgent: DEFAULT_USER_AGENT
    };

    sharedWindow = mockStencilSystem().createDom().parse(opts);
  }

  // we don't have a window created, so use the shared one
  return sharedWindow[key];
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
    opts.url = DEFAULT_URL;
  }

  if (typeof opts.userAgent !== 'string') {
    opts.userAgent = DEFAULT_USER_AGENT;
  }
}


const DEFAULT_URL = `http://testwindow.stenciljs.com/`;
const DEFAULT_USER_AGENT = `testwindow`;
