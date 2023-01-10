import { generatePreamble, normalizePath } from '@utils';
import { join, relative } from 'path';

import type * as d from '../../declarations';
import { getClientPolyfill } from '../app-core/app-polyfills';
import { isOutputTargetDistLazyLoader, relativeImport } from './output-utils';

export const outputLazyLoader = async (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistLazyLoader);
  if (outputTargets.length === 0) {
    return;
  }

  await Promise.all(outputTargets.map((o) => generateLoader(config, compilerCtx, o)));
};

const generateLoader = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  outputTarget: d.OutputTargetDistLazyLoader
) => {
  const loaderPath = outputTarget.dir;
  const es2017Dir = outputTarget.esmDir;
  const es5Dir = outputTarget.esmEs5Dir || es2017Dir;
  const cjsDir = outputTarget.cjsDir;

  if (!loaderPath || !es2017Dir || !cjsDir) {
    return;
  }

  const es5HtmlElement = await getClientPolyfill(config, compilerCtx, 'es5-html-element.js');

  const packageJsonContent = JSON.stringify(
    {
      name: config.fsNamespace + '-loader',
      private: true,
      typings: './index.d.ts',
      module: './index.js',
      main: './index.cjs.js',
      'jsnext:main': './index.es2017.js',
      es2015: './index.es2017.js',
      es2017: './index.es2017.js',
      unpkg: './cdn.js',
    },
    null,
    2
  );

  const es5EntryPoint = join(es5Dir, 'loader.js');
  const es2017EntryPoint = join(es2017Dir, 'loader.js');
  const polyfillsEntryPoint = join(es2017Dir, 'polyfills/index.js');
  const cjsEntryPoint = join(cjsDir, 'loader.cjs.js');
  const polyfillsExport = `export * from '${normalizePath(relative(loaderPath, polyfillsEntryPoint))}';`;
  const indexContent = `${generatePreamble(config)}
${es5HtmlElement}
${polyfillsExport}
export * from '${normalizePath(relative(loaderPath, es5EntryPoint))}';
`;
  const indexES2017Content = `${generatePreamble(config)}
${polyfillsExport}
export * from '${normalizePath(relative(loaderPath, es2017EntryPoint))}';
`;
  const indexCjsContent = `${generatePreamble(config)}
module.exports = require('${normalizePath(relative(loaderPath, cjsEntryPoint))}');
module.exports.applyPolyfills = function() { return Promise.resolve() };
`;

  const indexDtsPath = join(loaderPath, 'index.d.ts');
  await Promise.all([
    compilerCtx.fs.writeFile(join(loaderPath, 'package.json'), packageJsonContent),
    compilerCtx.fs.writeFile(join(loaderPath, 'index.d.ts'), generateIndexDts(indexDtsPath, outputTarget.componentDts)),
    compilerCtx.fs.writeFile(join(loaderPath, 'index.js'), indexContent),
    compilerCtx.fs.writeFile(join(loaderPath, 'index.cjs.js'), indexCjsContent),
    compilerCtx.fs.writeFile(join(loaderPath, 'cdn.js'), indexCjsContent),
    compilerCtx.fs.writeFile(join(loaderPath, 'index.es2017.js'), indexES2017Content),
  ]);
};

const generateIndexDts = (indexDtsPath: string, componentsDtsPath: string) => {
  return `export * from '${relativeImport(indexDtsPath, componentsDtsPath, '.d.ts')}';
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

/** 
 * Used to specify a nonce value that corresponds with an application's CSP.
 * When set, the nonce will be added to all dynamically created script and style tags at runtime.
 * Alternatively, the nonce value can be set on a meta tag in the DOM head
 * (<meta name="csp-nonce" content="{ nonce value here }" />) which
 * will result in the same behavior.
 */
export declare function setNonce(nonce: string): void;
`;
};
