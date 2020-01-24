import * as d from '../../declarations';

import { isOutputTargetDistLazyLoader } from './output-utils';
import { normalizePath, relativeImport } from '@utils';
import { getClientPolyfill } from '../app-core/app-polyfills';

export async function outputLazyLoader(config: d.Config, compilerCtx: d.CompilerCtx) {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistLazyLoader);
  if (outputTargets.length === 0) {
    return;
  }

  await Promise.all(
    outputTargets.map(o => generateLoader(config, compilerCtx, o))
  );
}

async function generateLoader(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDistLazyLoader) {
  const loaderPath = outputTarget.dir;
  const es2017Dir = outputTarget.esmDir;
  const es5Dir = outputTarget.esmEs5Dir || es2017Dir;
  const cjsDir = outputTarget.cjsDir;

  if (!loaderPath || !es2017Dir || !cjsDir) {
    return;
  }

  const es5HtmlElement = await getClientPolyfill(config, 'es5-html-element.js');

  const packageJsonContent = JSON.stringify({
    'name': config.fsNamespace + '-loader',
    'typings': './index.d.ts',
    'module': './index.mjs',
    'main': './index.cjs.js',
    'node:main': './node-main.js',
    'jsnext:main': './index.es2017.mjs',
    'es2015': './index.es2017.mjs',
    'es2017': './index.es2017.mjs',
    'unpkg': './cdn.js',
  }, null, 2);

  const es5EntryPoint = config.sys.path.join(es5Dir, 'loader.mjs');
  const es2017EntryPoint = config.sys.path.join(es2017Dir, 'loader.mjs');
  const polyfillsEntryPoint = config.sys.path.join(es2017Dir, 'polyfills/index.js');
  const cjsEntryPoint = config.sys.path.join(cjsDir, 'loader.cjs.js');
  const polyfillsExport = `export * from '${normalizePath(config.sys.path.relative(loaderPath, polyfillsEntryPoint))}';`;
  const indexContent = `
${es5HtmlElement}
${polyfillsExport}
export * from '${normalizePath(config.sys.path.relative(loaderPath, es5EntryPoint))}';
`;
  const indexES2017Content = `
${polyfillsExport}
export * from '${normalizePath(config.sys.path.relative(loaderPath, es2017EntryPoint))}';
`;
  const indexCjsContent = `
module.exports = require('${normalizePath(config.sys.path.relative(loaderPath, cjsEntryPoint))}');
module.exports.applyPolyfills = function() { return Promise.resolve() };
`;
  const nodeMainContent = `
module.exports.applyPolyfills = function() { return Promise.resolve() };
module.exports.defineCustomElements = function() { return Promise.resolve() };
`;


  const indexDtsPath = config.sys.path.join(loaderPath, 'index.d.ts');
  await Promise.all([
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'package.json'), packageJsonContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.d.ts'), generateIndexDts(config, indexDtsPath, outputTarget.componentDts)),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.mjs'), indexContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.cjs.js'), indexCjsContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'cdn.js'), indexCjsContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.es2017.mjs'), indexES2017Content),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'node-main.js'), nodeMainContent)
  ]);
}


function generateIndexDts(config: d.Config, indexDtsPath: string, componentsDtsPath: string) {
  return `
export * from '${relativeImport(config, indexDtsPath, componentsDtsPath, '.d.ts')}';
export interface CustomElementsDefineOptions {
  exclude?: string[];
  resourcesUrl?: string;
  syncQueue?: boolean;
  jmp?: (c: Function) => any;
  raf?: (c: FrameRequestCallback) => number;
  ael?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
  rel?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
}
export declare function defineCustomElements(win?: Window, opts?: CustomElementsDefineOptions): Promise<void>;
export declare function applyPolyfills(): Promise<void>;
`;
}
