import * as d from '../declarations';
import { fillCmpMetaFromConstructor } from '../server/cmp-meta';
import { mockLogger, mockStencilSystem } from './mocks';
import { Renderer } from '../server';
import { validateConfig } from '../compiler/config/validate-config';


const testPlatforms = new WeakMap<Element, d.PlatformApi>();


export async function render(opts: RenderTestOptions): Promise<any> {
  let rootElm: Element = null;

  try {
    validateRenderOptions(opts);

    const config = getTestBuildConfig();
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

    rootElm = (results.root && results.root.children.length > 1 && results.root.children[1].firstElementChild) || null;
    if (rootElm) {
      testPlatforms.set(rootElm, (results as any).__testPlatform);
      delete (results as any).__testPlatform;
    }

  } catch (e) {
    console.error(e);
  }

  return rootElm;
}


export async function flush(root: any) {
  const testPlt = testPlatforms.get(root);

  if (!testPlt) {
    throw new Error(`invalid testing root node`);
  }

  await testPlt.queue.flush();
}


function getTestBuildConfig() {
  const sys = mockStencilSystem();

  const config: d.Config = {
    sys: sys,
    logger: mockLogger(),
    rootDir: '/',
    suppressTypeScriptErrors: true,
    devMode: true
  };

  config.devMode = true;
  config._isTesting = true;

  return validateConfig(config);
}


function validateRenderOptions(opts: RenderTestOptions) {
  if (!opts) {
    throw new Error('missing render() options');
  }
  if (!opts.components) {
    throw new Error(`missing render() components: ${opts}`);
  }
  if (!Array.isArray(opts.components)) {
    throw new Error(`render() components must be an array: ${opts}`);
  }
  if (typeof opts.html !== 'string') {
    throw new Error(`render() html must be a string: ${opts}`);
  }
}


export interface RenderTestOptions {
  components: any[];
  html: string;
}
