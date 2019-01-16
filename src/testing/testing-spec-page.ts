import * as d from '../declarations';
import { resetBuildConditionals } from './testing-build';
import { TestingCmpCstr } from './testing-decorators';


export async function newSpecPage(opts: d.NewSpecPageOptions) {
  if (opts == null) {
    throw new Error(`NewSpecPageOptions required`);
  }

  if (!Array.isArray(opts.components) || opts.components.length === 0) {
    throw new Error(`opts.components required`);
  }

  // see comment at the bottom of the page
  const platform = require('@stencil/core/platform');
  platform.resetPlatform();

  // see comment at the bottom of the page
  const bc = require('@stencil/core/build-conditionals');
  const BUILD = resetBuildConditionals(bc.BUILD);

  if (opts.build != null) {
    Object.assign(BUILD, opts.build);
  }

  // see comment at the bottom of the page
  const runtime = require('@stencil/core/runtime');

  const testingCmps = opts.components.map((Cstr: TestingCmpCstr) => {
    const bundleId = Cstr.ComponentOptions.tag;

    if (!Cstr.ComponentOptions) {
      throw new Error(`@Component() decorator required`);
    }

    if (Cstr.ComponentOptions.shadow) {
      BUILD.shadowDom = true;
    }
    if (Cstr.ComponentOptions.scoped) {
      BUILD.scoped = true;
    }

    if (Cstr.Element) {
      BUILD.element = true;
      BUILD.member = true;
    }

    if (Cstr.Method) {
      BUILD.method = true;
      BUILD.member = true;
    }

    if (Cstr.Listen) {
      BUILD.listener = true;
      BUILD.member = true;
    }

    if (Cstr.Prop) {
      BUILD.prop = true;
      BUILD.member = true;
      BUILD.updatable = true;
      BUILD.observeAttr = true;

      if (Cstr.PropMutable) {
        BUILD.propMutable = true;
      }
      if (Cstr.ReflectToAttr) {
        BUILD.reflectToAttr = true;
      }
    }

    if (Cstr.State) {
      BUILD.state = true;
      BUILD.member = true;
      BUILD.updatable = true;
    }

    if (Cstr.Watch) {
      BUILD.watchCallback = true;
    }

    if (Cstr.prototype.connectedCallback) BUILD.connectedCallback = true;
    if (Cstr.prototype.disconnectedCallback) BUILD.disconnectedCallback = true;
    if (Cstr.prototype.componentWillLoad) BUILD.cmpWillLoad = true;
    if (Cstr.prototype.componentDidLoad) BUILD.cmpDidLoad = true;
    if (Cstr.prototype.componentWillUpdate) BUILD.cmpWillUpdate = true;
    if (Cstr.prototype.componentDidUpdate) BUILD.cmpDidUpdate = true;
    if (Cstr.prototype.componentDidUnload) BUILD.cmpDidUnload = true;
    if (Cstr.prototype.render) BUILD.hasRenderFn = true;
    if (Cstr.prototype.hostData) BUILD.hostData = true;

    const ProxiedCstr = new Proxy<any>(Cstr, {
      construct(target, args: any[]) {
        const instance = new target();
        runtime.registerLazyInstance(instance, args[0]);
        return instance;
      }
    });

    const lazyBundleRuntimeMeta: d.LazyBundleRuntimeMeta = [
      bundleId,
      [{
        cmpTag: Cstr.ComponentOptions.tag,
        members: [],
        scopedCssEncapsulation: !!Cstr.ComponentOptions.scoped,
        shadowDomEncapsulation: !!Cstr.ComponentOptions.shadow
      }]
    ];

    registerModule(bundleId, ProxiedCstr);

    return lazyBundleRuntimeMeta;
  });

  const plt = {
    win: platform.win as Window,
    doc: platform.doc as Document,
    body: platform.doc.body as HTMLBodyElement,
    head: platform.doc.head as HTMLHeadElement,
    opts: BUILD,
    flush: async () => await platform.flushAll()
  };

  if (typeof opts.url === 'string') {
    plt.win.location.href = opts.url;
  }

  if (opts.build == null || opts.build.lazyLoad !== false) {
    runtime.bootstrapLazy(testingCmps);
  }

  if (typeof opts.html === 'string') {
    plt.body.innerHTML = opts.html;
  }

  if (opts.flushQueue !== false) {
    await plt.flush();
  }

  return plt;
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


export function registerModule(bundleId: string, Cstr: any) {
  // see comment at the bottom of the page
  const platform = require('@stencil/core/platform');
  return platform.registerModule(bundleId, Cstr);
}


// * WHY THE REQUIRES?!
// using require() in a closure so jest has a moment
// to jest.mock w/ moduleNameMapper in the jest config
// otherwise the require() happens at the top of the file before jest is setup
