import * as d from '../declarations';
import { formatLazyBundleRuntimeMeta, getBuildFeatures } from '../compiler';


export async function newSpecPage(opts: d.NewSpecPageOptions) {
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

  const lazyBundles: d.LazyBundlesRuntimeData = opts.components.map((Cstr: d.ComponentTestingConstructor) => {
    if (Cstr.COMPILER_META == null) {
      throw new Error(`Invalid component class: Missing static "COMPILER_META" property.`);
    }

    cmpTags.add(Cstr.COMPILER_META.tagName);

    const cmpBuild = getBuildFeatures([Cstr.COMPILER_META]) as any;

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

    const bundleId = `${Cstr.COMPILER_META.tagName}.${(Math.round(Math.random() * 89999) + 10000)}`;

    const lazyBundleRuntimeMeta = formatLazyBundleRuntimeMeta(bundleId, [Cstr.COMPILER_META]);

    platform.registerModule(bundleId, Cstr);

    if (Array.isArray(Cstr.COMPILER_META.styles)) {
      Cstr.COMPILER_META.styles.forEach(style => {
        platform.styles.set(style.styleId, style.styleStr);
      });
    }

    return lazyBundleRuntimeMeta;
  });

  const win = platform.getWin() as Window;
  const doc = win.document;

  const results = {
    win: win,
    doc: doc,
    head: doc.head,
    body: doc.body,
    root: null as any,
    rootInstance: null as any,
    build: bc.BUILD as d.Build,
    styles: platform.styles as Map<string, string>,
    flush: (): Promise<void> => platform.flushAll(),
    flushLoadModule: (bundleId?: string): Promise<void> => platform.flushLoadModule(bundleId),
    flushQueue: (): Promise<void> => platform.flushQueue()
  };

  if (typeof opts.url === 'string') {
    results.win.location.href = opts.url;
  }

  if (typeof opts.direction === 'string') {
    results.doc.documentElement.setAttribute('dir', opts.direction);
  }

  if (typeof opts.language === 'string') {
    results.doc.documentElement.setAttribute('lang', opts.language);
  }

  if (typeof opts.cookie === 'string') {
    try {
      results.doc.cookie = opts.cookie;
    } catch (e) {}
  }

  if (typeof opts.referrer === 'string') {
    try {
      (results.doc as any).referrer = opts.referrer;
    } catch (e) {}
  }

  if (typeof opts.userAgent === 'string') {
    try {
      (results.win.navigator as any).userAgent = opts.userAgent;
    } catch (e) {}
  }

  platform.bootstrapLazy(lazyBundles, win);

  if (typeof opts.html === 'string') {
    results.body.innerHTML = opts.html;
  }

  if (opts.flushQueue !== false) {
    await results.flush();
  }

  results.root = findRoot(cmpTags, results.body);
  if (results.root != null) {
    results.rootInstance = platform.getHostRef(results.root).$lazyInstance$;
  }

  if (opts.hydrateServerSide) {
    platform.insertVdomAnnotations(doc);
  }

  return results;
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
