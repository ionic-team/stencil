import * as d from '@declarations';
import { resetBuildConditionals } from './testing-build';


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

  const testingCmps = opts.components.map((Cstr: d.ComponentConstructor) => {
    if (typeof Cstr.is !== 'string') {
      throw new Error(`Invalid component class. Requires the @Component() decorator with tag, or static "is" property.`);
    }

    const bundleId = Cstr.is;

    const cmpBuild = (Cstr as any).BUILD;
    if (cmpBuild != null) {
      Object.keys(cmpBuild).forEach(key => {
        if (cmpBuild[key] === true) {
          (BUILD as any)[key] = true;
        }
      });
    }

    const ProxiedCstr = new Proxy<any>(Cstr, {
      construct(target, args: any[]) {
        const instance = new target();
        platform.registerLazyInstance(instance, args[0]);
        return instance;
      }
    });

    const lazyBundleRuntimeMeta: d.LazyBundleRuntimeMeta = [
      bundleId,
      [{
        cmpTag: Cstr.is,
        members: [],
        scopedCssEncapsulation: (Cstr.encapsulation === 'scoped'),
        shadowDomEncapsulation: (Cstr.encapsulation === 'shadow')
      }]
    ];

    registerModule(bundleId, ProxiedCstr);

    return lazyBundleRuntimeMeta;
  });

  if (opts.build != null) {
    Object.assign(BUILD, opts.build);
  }

  const plt = {
    win: platform.win as Window,
    doc: platform.doc as Document,
    body: platform.doc.body as HTMLBodyElement,
    head: platform.doc.head as HTMLHeadElement,
    opts: BUILD,
    flush: (): Promise<void> => platform.flushAll(),
    flushLoadModule: (): Promise<void> => platform.flushLoadModule(),
    flushQueue: (): Promise<void> => platform.flushQueue()
  };

  if (typeof opts.url === 'string') {
    plt.win.location.href = opts.url;
  }

  const runtime = require('@stencil/core/runtime');

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
