import * as d from '@declarations';
import { formatComponentRuntimeMeta, getBuildFeatures } from '@compiler';
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

  const lazyLoad = (opts.lazyLoad !== false);

  const testingCmps = opts.components.map((Cstr: d.ComponentConstructorStaticMeta) => {
    if (typeof Cstr.is !== 'string') {
      throw new Error(`Invalid component class: Requires the @Component() decorator with "tag", or static "is" property.`);
    }

    if (Cstr.CMP_META == null) {
      throw new Error(`Invalid component class: Missing static "CMP_META" property.`);
    }

    const cmpBuild = getBuildFeatures([Cstr.CMP_META]) as any;

    Object.keys(cmpBuild).forEach(key => {
      if (cmpBuild[key] === true) {
        (BUILD as any)[key] = true;
      }
    });

    if (lazyLoad) {
      const bundleId = Cstr.is + Math.round(Math.random() * 99999);

      const ProxiedCstr = new Proxy<any>(Cstr, {
        construct(target, args: any[]) {
          const instance = new target();
          platform.registerLazyInstance(instance, args[0]);
          return instance;
        }
      });

      const lazyBundleRuntimeMeta: d.LazyBundleRuntimeMeta = [
        bundleId,
        [formatComponentRuntimeMeta(Cstr.CMP_META, true)]
      ];

      registerModule(bundleId, ProxiedCstr);

      return lazyBundleRuntimeMeta;

    } else {
      throw new Error('todo!');
    }
  });

  const plt = {
    win: platform.win as Window,
    doc: platform.doc as Document,
    body: platform.doc.body as HTMLBodyElement,
    head: platform.doc.head as HTMLHeadElement,
    build: BUILD,
    flush: (): Promise<void> => platform.flushAll(),
    flushLoadModule: (): Promise<void> => platform.flushLoadModule(),
    flushQueue: (): Promise<void> => platform.flushQueue()
  };

  if (typeof opts.url === 'string') {
    plt.win.location.href = opts.url;
  }

  const runtime = require('@stencil/core/runtime');

  if (lazyLoad) {
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
