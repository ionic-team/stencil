import { bootstrapLazy, flushAll, flushLoadModule, flushQueue, getHostRef, insertVdomAnnotations, plt, registerComponents, registerContext, registerModule, renderVdom, resetPlatform, startAutoApplyChanges, styles, win, writeTask } from '@stencil/core/internal/testing';
import { BUILD } from '@app-data';
import { ComponentCompilerMeta, ComponentRuntimeMeta, ComponentTestingConstructor, HostRef, LazyBundlesRuntimeData, NewSpecPageOptions, SpecPage } from '@stencil/core/internal';
import { formatLazyBundleRuntimeMeta, getBuildFeatures } from '../compiler';
import { resetBuildConditionals } from './reset-build-conditionals';


export async function newSpecPage(opts: NewSpecPageOptions): Promise<SpecPage> {
  if (opts == null) {
    throw new Error(`NewSpecPageOptions required`);
  }

  // reset the platform for this new test
  resetPlatform();
  resetBuildConditionals(BUILD);

  registerContext(opts.context);

  if (Array.isArray(opts.components)) {
    registerComponents(opts.components);
  }

  if (opts.hydrateClientSide) {
    opts.includeAnnotations = true;
  }
  if (opts.hydrateServerSide) {
    opts.includeAnnotations = true;
    plt.$supportsShadow$ = false;
  } else {
    opts.includeAnnotations = !!opts.includeAnnotations;
    if (opts.supportsShadowDom === false) {
      plt.$supportsShadow$ = false;
    } else {
      plt.$supportsShadow$ = true;
    }
  }
  BUILD.cssAnnotations = opts.includeAnnotations;

  const cmpTags = new Set<string>();

  (win as any)['__stencil_spec_options'] = opts;
  const doc = win.document;

  const page: SpecPage = {
    win: win,
    doc: doc,
    body: doc.body as any,
    build: BUILD,
    styles: styles as Map<string, string>,
    setContent: (html) => {
      doc.body.innerHTML = html;
      return flushAll();
    },
    waitForChanges: flushAll,
    flushLoadModule: flushLoadModule,
    flushQueue: flushQueue
  };

  const lazyBundles: LazyBundlesRuntimeData = opts.components.map((Cstr: ComponentTestingConstructor) => {
    if (Cstr.COMPILER_META == null) {
      throw new Error(`Invalid component class: Missing static "COMPILER_META" property.`);
    }

    cmpTags.add(Cstr.COMPILER_META.tagName);
    Cstr.isProxied = false;

    proxyComponentLifeCycles(Cstr);

    const bundleId = `${Cstr.COMPILER_META.tagName}.${(Math.round(Math.random() * 899999) + 100000)}`;
    const lazyBundleRuntimeMeta = formatLazyBundleRuntimeMeta(bundleId, [Cstr.COMPILER_META]);

    registerModule(bundleId, Cstr);

    if (Array.isArray(Cstr.COMPILER_META.styles)) {
      Cstr.COMPILER_META.styles.forEach(style => {
        styles.set(style.styleId, style.styleStr);
      });
    }

    return lazyBundleRuntimeMeta;
  });

  const cmpCompilerMeta = opts.components.map(Cstr => Cstr.COMPILER_META as ComponentCompilerMeta);

  const cmpBuild = getBuildFeatures(cmpCompilerMeta);
  if (opts.strictBuild) {
    Object.assign(BUILD, cmpBuild);
  } else {
    Object.keys(cmpBuild).forEach(key => {
      if ((cmpBuild as any)[key] === true) {
        (BUILD as any)[key] = true;
      }
    });
  }
  BUILD.asyncLoading = true;
  if (opts.hydrateClientSide) {
    BUILD.hydrateClientSide = true;
    BUILD.hydrateServerSide = false;

  } else if (opts.hydrateServerSide) {
    BUILD.hydrateServerSide = true;
    BUILD.hydrateClientSide = false;
  }
  BUILD.cloneNodeFix = false;
  BUILD.shadowDomShim = false;
  BUILD.safari10 = false;

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
    } catch (e) { }
  }

  if (typeof opts.referrer === 'string') {
    try {
      (page.doc as any).referrer = opts.referrer;
    } catch (e) { }
  }

  if (typeof opts.userAgent === 'string') {
    try {
      (page.win.navigator as any).userAgent = opts.userAgent;
    } catch (e) { }
  }

  bootstrapLazy(lazyBundles);

  if (typeof opts.template === 'function') {
    const cmpMeta: ComponentRuntimeMeta = {
      $flags$: 0,
      $tagName$: 'body'
    };
    const ref: HostRef = {
      $ancestorComponent$: undefined,
      $flags$: 0,
      $modeName$: undefined,
      $cmpMeta$: cmpMeta,
      $hostElement$: page.body
    };
    renderVdom(ref, opts.template());
  } else if (typeof opts.html === 'string') {
    page.body.innerHTML = opts.html;
  }

  if (opts.flushQueue !== false) {
    await page.waitForChanges();
  }

  let rootComponent: any = null;
  Object.defineProperty(page, 'root', {
    get() {
      if (rootComponent == null) {
        rootComponent = findRootComponent(cmpTags, page.body);
      }
      if (rootComponent != null) {
        return rootComponent;
      }
      const firstElementChild = page.body.firstElementChild;
      if (firstElementChild != null) {
        return firstElementChild as any;
      }
      return null;
    }
  });

  Object.defineProperty(page, 'rootInstance', {
    get() {
      const hostRef = getHostRef(page.root);
      if (hostRef != null) {
        return hostRef.$lazyInstance$;
      }
      return null;
    }
  });

  if (opts.hydrateServerSide) {
    insertVdomAnnotations(doc);
  }

  if (opts.autoApplyChanges) {
    startAutoApplyChanges();
    page.waitForChanges = () => {
      console.error('waitForChanges() cannot be used manually if the "startAutoApplyChanges" option is enabled');
      return Promise.resolve();
    };
  }
  return page;
}

function proxyComponentLifeCycles(Cstr: ComponentTestingConstructor) {
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
    Cstr.prototype.componentWillLoad = function () {
      const result = this.__componentWillLoad();
      if (result != null && typeof result.then === 'function') {
        writeTask(() => result);
      } else {
        writeTask(() => Promise.resolve());
      }
      return result;
    };
  }

  if (typeof Cstr.prototype.componentWillUpdate === 'function') {
    Cstr.prototype.__componentWillUpdate = Cstr.prototype.componentWillUpdate;
    Cstr.prototype.componentWillUpdate = function () {
      const result = this.__componentWillUpdate();
      if (result != null && typeof result.then === 'function') {
        writeTask(() => result);
      } else {
        writeTask(() => Promise.resolve());
      }
      return result;
    };
  }

  if (typeof Cstr.prototype.componentWillRender === 'function') {
    Cstr.prototype.__componentWillRender = Cstr.prototype.componentWillRender;
    Cstr.prototype.componentWillRender = function () {
      const result = this.__componentWillRender();
      if (result != null && typeof result.then === 'function') {
        writeTask(() => result);
      } else {
        writeTask(() => Promise.resolve());
      }
      return result;
    };
  }
}

function findRootComponent(cmpTags: Set<string>, node: Element): any {
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
      const r = findRootComponent(cmpTags, children[i]);
      if (r != null) {
        return r;
      }
    }
  }
  return null;
}
