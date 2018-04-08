import * as d from '../declarations';
import { fillCmpMetaFromConstructor } from '../server/cmp-meta';
import { JestLogger } from './jest-logger';
import { mockStencilSystem } from './mocks';
import { Renderer } from '../server';
import { transpileModuleForTesting } from '../compiler/transpile/transpile-testing';
import { validateConfig } from '../compiler/config/validate-config';
import * as ts from 'typescript';


const sys = mockStencilSystem();
const testPlatforms = new WeakMap<Element, d.PlatformApi>();
const testLoggers = new WeakMap<Element, JestLogger>();


export async function render(opts: RenderTestOptions): Promise<any> {
  let rootElm: Element = null;

  const testLogger = new JestLogger();
  const testConfig = getTestingSuiteConfig(sys, testLogger);

  try {
    validateRenderOptions(opts);

    const compilerCtx: d.CompilerCtx = {};
    const registry: d.ComponentRegistry = {};

    opts.components.forEach((testCmp: d.ComponentConstructor) => {
      if (testCmp) {
        const cmpMeta = fillCmpMetaFromConstructor(testCmp, {});
        registry[cmpMeta.tagNameMeta] = cmpMeta;
      }
    });

    const renderer = new Renderer(testConfig, registry, compilerCtx);

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
      testLoggers.set(rootElm, (results as any).__testLogger);

      delete (results as any).__testPlatform;
      delete (results as any).__testLogger;
    }

  } catch (e) {
    testLogger.error(e);
  }

  testLogger.printLogs();

  return rootElm;
}


export async function flush(elm: any) {
  const testPlt = testPlatforms.get(elm);

  if (!testPlt) {
    throw new Error(`invalid testing root node`);
  }

  await testPlt.queue.flush();

  const testLogger = testLoggers.get(elm);
  if (testLogger) {
    testLogger.printLogs();
  }
}

export function transpile(input: string, opts: TranspileOptions = {}, path?: string) {
  const results: TranspileResults = { diagnostics: null, code: null };

  if (!opts.module) {
    opts.module = 'CommonJS';
  }

  const compilerOpts: ts.CompilerOptions = Object.assign({}, opts as any);

  if (!path) {
    path = '/tmp/transpile.tsx';
  }

  const testLogger = new JestLogger();
  const testConfig = getTestingSuiteConfig(sys, testLogger);

  const transpileResults = transpileModuleForTesting(testConfig, compilerOpts, path, input);

  results.code = transpileResults.code;
  results.diagnostics = transpileResults.diagnostics;

  testLogger.printLogs();

  return results;
}


export interface TranspileOptions {
  module?: 'None' | 'CommonJS' | 'AMD' | 'System' | 'UMD' | 'ES6' | 'ES2015' | 'ESNext' | string;
  target?: 'ES5' | 'ES6' | 'ES2015' | 'ES2016' | 'ES2017' | 'ESNext' | string;
  [key: string]: any;
}


export interface TranspileResults {
  diagnostics: d.Diagnostic[];
  code?: string;
}


function getTestingSuiteConfig(sys: d.StencilSystem, logger: d.Logger) {
  const config: d.Config = {
    sys: sys,
    logger: logger,
    rootDir: '/',
    devMode: true,
    _isTesting: true
  };

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
