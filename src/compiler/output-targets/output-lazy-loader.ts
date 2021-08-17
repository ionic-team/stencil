import type * as d from '../../declarations';
import { getClientPolyfill } from '../app-core/app-polyfills';
import { isOutputTargetDistLazyLoader, relativeImport } from './output-utils';
import { join, relative } from 'path';
import { getStencilCompilerContext, normalizePath } from '@utils';

export const outputLazyLoader = async (config: d.Config) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistLazyLoader);
  if (outputTargets.length === 0) {
    return;
  }

  await Promise.all(outputTargets.map((o) => generateLoader(config, o)));
};

const generateLoader = async (config: d.Config, outputTarget: d.OutputTargetDistLazyLoader) => {
  const loaderPath = outputTarget.dir;
  const es2017Dir = outputTarget.esmDir;
  const es5Dir = outputTarget.esmEs5Dir || es2017Dir;
  const cjsDir = outputTarget.cjsDir;

  if (!loaderPath || !es2017Dir || !cjsDir) {
    return;
  }

  const es5HtmlElement = await getClientPolyfill(config, 'es5-html-element.js');

  const packageJsonContent = JSON.stringify(
    {
      name: config.fsNamespace + '-loader',
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
  const indexContent = `
${es5HtmlElement}
${polyfillsExport}
export * from '${normalizePath(relative(loaderPath, es5EntryPoint))}';
`;
  const indexES2017Content = `
${polyfillsExport}
export * from '${normalizePath(relative(loaderPath, es2017EntryPoint))}';
`;
  const indexCjsContent = `
module.exports = require('${normalizePath(relative(loaderPath, cjsEntryPoint))}');
module.exports.applyPolyfills = function() { return Promise.resolve() };
`;

  const indexDtsPath = join(loaderPath, 'index.d.ts');
  await Promise.all([
    getStencilCompilerContext().fs.writeFile(join(loaderPath, 'package.json'), packageJsonContent),
    getStencilCompilerContext().fs.writeFile(
      join(loaderPath, 'index.d.ts'),
      generateIndexDts(indexDtsPath, outputTarget.componentDts)
    ),
    getStencilCompilerContext().fs.writeFile(join(loaderPath, 'index.js'), indexContent),
    getStencilCompilerContext().fs.writeFile(join(loaderPath, 'index.cjs.js'), indexCjsContent),
    getStencilCompilerContext().fs.writeFile(join(loaderPath, 'cdn.js'), indexCjsContent),
    getStencilCompilerContext().fs.writeFile(join(loaderPath, 'index.es2017.js'), indexES2017Content),
  ]);
};

const generateIndexDts = (indexDtsPath: string, componentsDtsPath: string) => {
  return `
export * from '${relativeImport(indexDtsPath, componentsDtsPath, '.d.ts')}';
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
};
