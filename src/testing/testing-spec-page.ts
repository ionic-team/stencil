import * as d from '@declarations';
import { formatLazyBundleRuntimeMeta, getBuildFeatures } from '@compiler';


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

  const cmpTags = new Set<string>();

  const lazyBundles: d.LazyBundlesRuntimeData = opts.components.map((Cstr: d.ComponentTestingConstructor) => {
    if (Cstr.COMPILER_META == null) {
      throw new Error(`Invalid component class: Missing static "COMPILER_META" property.`);
    }

    cmpTags.add(Cstr.COMPILER_META.tagName);

    const cmpBuild = getBuildFeatures([Cstr.COMPILER_META]) as any;

    Object.keys(cmpBuild).forEach(key => {
      if (cmpBuild[key] === true) {
        (bc.BUILD as any)[key] = true;
      }
    });

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

  const win = platform.getWindow() as Window;

  const plt = {
    win: win,
    doc: win.document,
    head: win.document.head,
    body: win.document.body,
    root: null as any,
    rootInstance: null as any,
    build: bc.BUILD as d.Build,
    styles: platform.styles as Map<string, string>,
    flush: (): Promise<void> => platform.flushAll(),
    flushLoadModule: (bundleId?: string): Promise<void> => platform.flushLoadModule(bundleId),
    flushQueue: (): Promise<void> => platform.flushQueue()
  };

  if (typeof opts.url === 'string') {
    plt.win.location.href = opts.url;
  }

  if (typeof opts.direction === 'string') {
    plt.doc.documentElement.setAttribute('dir', opts.direction);
  }

  if (typeof opts.language === 'string') {
    plt.doc.documentElement.setAttribute('lang', opts.language);
  }

  if (typeof opts.cookie === 'string') {
    try {
      plt.doc.cookie = opts.cookie;
    } catch (e) {}
  }

  if (typeof opts.referrer === 'string') {
    try {
      (plt.doc as any).referrer = opts.referrer;
    } catch (e) {}
  }

  if (typeof opts.userAgent === 'string') {
    try {
      (plt.win.navigator as any).userAgent = opts.userAgent;
    } catch (e) {}
  }

  platform.bootstrapLazy(lazyBundles);

  if (typeof opts.html === 'string') {
    plt.body.innerHTML = opts.html;
  }

  if (opts.flushQueue !== false) {
    await plt.flush();
  }

  plt.root = findRoot(cmpTags, plt.body);
  if (plt.root) {
    plt.rootInstance = platform.getHostRef(plt.root).$lazyInstance$;
  }
  return plt;
}


function findRoot(cmpTags: Set<string>, node: Element): any {
  if (node != null) {
    const children = node.children;

    for (let i = 0; i < children.length; i++) {
      const elm = children[i];
      if (cmpTags.has(elm.nodeName.toLowerCase())) {
        return elm;
      }
    }

    for (let i = 0; i < children.length; i++) {
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
