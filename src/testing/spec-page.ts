import * as d from '../declarations';
import { formatLazyBundleRuntimeMeta, getBuildFeatures } from '../compiler';


export async function newSpecPage(opts: d.NewSpecPageOptions): Promise<d.SpecPage> {
  if (opts == null) {
    throw new Error(`NewSpecPageOptions required`);
  }

  if (!Array.isArray(opts.components) || opts.components.length === 0) {
    throw new Error(`opts.components required`);
  }

  // * WHY THE REQUIRES?!
  // using require() in a closure so jest has a moment
  // to jest.mock w/ moduleNameMapper in the jest config
  // otherwise the require() happens at the top of the file before jest is setup
  const bc = require('@stencil/core/build-conditionals');
  const platform = require('@stencil/core/platform');

  // reset the platform for this new test
  platform.resetPlatform();
  bc.resetBuildConditionals(bc.BUILD);

  platform.registerComponents(opts.components);

  if (opts.hydrateServerSide) {
    platform.supportsShadowDom = false;
  } else {
    if (opts.serializedShadowDom === false) {
      platform.supportsShadowDom = false;
    } else {
      platform.supportsShadowDom = true;
    }
  }

  const cmpTags = new Set<string>();

  const win = platform.win as Window;
  const doc = win.document;

  const page: d.SpecPage = {
    win: win,
    doc: doc,
    body: doc.body as any,
    root: null as any,
    rootInstance: null as any,
    build: bc.BUILD as d.Build,
    styles: platform.styles as Map<string, string>,
    setContent: (html: string) => {
      doc.body.innerHTML = html;
      return platform.flushAll();
    },
    waitForChanges: (): Promise<void> => platform.flushAll(),
    flushLoadModule: (bundleId?: string): Promise<void> => platform.flushLoadModule(bundleId),
    flushQueue: (): Promise<void> => platform.flushQueue()
  };

  const lazyBundles: d.LazyBundlesRuntimeData = opts.components.map((Cstr: d.ComponentTestingConstructor) => {
    if (Cstr.COMPILER_META == null) {
      throw new Error(`Invalid component class: Missing static "COMPILER_META" property.`);
    }

    cmpTags.add(Cstr.COMPILER_META.tagName);
    Cstr.isProxied = false;

    proxyComponentLifeCycles(platform, Cstr);

    const bundleId = `${Cstr.COMPILER_META.tagName}.${(Math.round(Math.random() * 899999) + 100000)}`;
    const lazyBundleRuntimeMeta = formatLazyBundleRuntimeMeta(bundleId, [Cstr.COMPILER_META]);

    platform.registerModule(bundleId, Cstr);

    if (Array.isArray(Cstr.COMPILER_META.styles)) {
      Cstr.COMPILER_META.styles.forEach(style => {
        platform.styles.set(style.styleId, style.styleStr);
      });
    }

    return lazyBundleRuntimeMeta;
  });

  const cmpBuild = getBuildFeatures(
    opts.components.map(Cstr => Cstr.COMPILER_META)
  ) as any;
  Object.keys(cmpBuild).forEach(key => {
    if ((cmpBuild as any)[key] === true) {
      (bc.BUILD as any)[key] = true;
    }
  });

  if (opts.hydrateClientSide) {
    bc.BUILD.hydrateClientSide = true;
    bc.BUILD.hydrateServerSide = false;

  } else if (opts.hydrateServerSide) {
    bc.BUILD.hydrateServerSide = true;
    bc.BUILD.hydrateClientSide = false;
  }

  (page as any).flush = () => {
    console.warn(`DEPRECATED: page.flush(), please use page.waitForChanges() instead`);
    return page.waitForChanges();
  };

  if (typeof opts.url === 'string') {
    page.win.location.href = opts.url;
  }

  if (typeof opts.direction === 'string') {
    page.doc.documentElement.setAttribute('dir', opts.direction);
  }

  if (typeof opts.language === 'string') {
    page.doc.documentElement.setAttribute('lang', opts.language);
  }

  if (typeof opts.cookie === 'string') {
    try {
      page.doc.cookie = opts.cookie;
    } catch (e) {}
  }

  if (typeof opts.referrer === 'string') {
    try {
      (page.doc as any).referrer = opts.referrer;
    } catch (e) {}
  }

  if (typeof opts.userAgent === 'string') {
    try {
      (page.win.navigator as any).userAgent = opts.userAgent;
    } catch (e) {}
  }

  platform.bootstrapLazy(lazyBundles);

  if (typeof opts.html === 'string') {
    page.body.innerHTML = opts.html;
  }

  if (opts.flushQueue !== false) {
    await page.waitForChanges();
  }

  page.root = findRoot(cmpTags, page.body);
  if (page.root != null) {
    page.rootInstance = platform.getHostRef(page.root).$lazyInstance$;
  }

  if (opts.hydrateServerSide) {
    platform.insertVdomAnnotations(doc);
  }

  return page;
}


function proxyComponentLifeCycles(platform: any, Cstr: d.ComponentTestingConstructor) {
  if (typeof Cstr.prototype.__componentWillLoad === 'function') {
    Cstr.prototype.componentWillLoad = Cstr.prototype.__componentWillLoad;
    Cstr.prototype.__componentWillLoad = null;
  }
  if (typeof Cstr.prototype.__componentWillUpdate === 'function') {
    Cstr.prototype.componentWillUpdate = Cstr.prototype.__componentWillUpdate;
    Cstr.prototype.__componentWillUpdate = null;
  }
  if (typeof Cstr.prototype.__componentWillRender === 'function') {
    Cstr.prototype.componentWillRender = Cstr.prototype.__componentWillRender;
    Cstr.prototype.__componentWillRender = null;
  }

  if (typeof Cstr.prototype.componentWillLoad === 'function') {
    Cstr.prototype.__componentWillLoad = Cstr.prototype.componentWillLoad;
    Cstr.prototype.componentWillLoad = function() {
      const result = this.__componentWillLoad();
      if (result != null && typeof result.then === 'function') {
        platform.writeTask(() => result);
      } else {
        platform.writeTask(() => Promise.resolve());
      }
      return result;
    };
  }

  if (typeof Cstr.prototype.componentWillUpdate === 'function') {
    Cstr.prototype.__componentWillUpdate = Cstr.prototype.componentWillUpdate;
    Cstr.prototype.componentWillUpdate = function() {
      const result = this.__componentWillUpdate();
      if (result != null && typeof result.then === 'function') {
        platform.writeTask(() => result);
      } else {
        platform.writeTask(() => Promise.resolve());
      }
      return result;
    };
  }

  if (typeof Cstr.prototype.componentWillRender === 'function') {
    Cstr.prototype.__componentWillRender = Cstr.prototype.componentWillRender;
    Cstr.prototype.componentWillRender = function() {
      const result = this.__componentWillRender();
      if (result != null && typeof result.then === 'function') {
        platform.writeTask(() => result);
      } else {
        platform.writeTask(() => Promise.resolve());
      }
      return result;
    };
  }
}


function findRoot(cmpTags: Set<string>, node: Element): any {
  if (node != null) {
    const children = node.children;
    const childrenLength = children.length;

    for (let i = 0; i < childrenLength; i++) {
      const elm = children[i];
      if (cmpTags.has(elm.nodeName.toLowerCase())) {
        return elm;
      }
    }

    for (let i = 0; i < childrenLength; i++) {
      const r = findRoot(cmpTags, children[i]);
      if (r != null) {
        return r;
      }
    }
  }
  return null;
}


export function flushAll() {
  // see comment at the bottom of the page
  const platform = require('@stencil/core/platform');
  return platform.flushAll();
}


export function flushQueue() {
  // see comment at the bottom of the page
  const platform = require('@stencil/core/platform');
  return platform.flushQueue();
}


export function flushLoadModule() {
  // see comment at the bottom of the page
  const platform = require('@stencil/core/platform');
  return platform.flushLoadModule();
}
