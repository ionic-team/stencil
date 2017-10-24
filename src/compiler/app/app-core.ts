import { BuildConfig } from '../../util/interfaces';
import { CORE_NAME } from '../../util/constants';
import { generatePreamble, normalizePath } from '../util';
import { getAppFileName } from './generate-app-files';


export function generateCore(config: BuildConfig, globalJsContent: string[]) {
  let staticName = CORE_NAME;
  if (!config.minifyJs) {
    staticName += '.dev';
  }
  staticName += '.js';

  return config.sys.getClientCoreFile({ staticName: staticName }).then(coreContent => {
    // concat the projects core code
    const jsContent = [
      globalJsContent.join('\n'),
      coreContent
    ].join('\n').trim();

    return wrapCoreJs(config, jsContent);
  });
}


export function generateCoreES5WithPolyfills(config: BuildConfig, globalJsContent: string[]) {
  const sys = config.sys;
  let staticName = CORE_NAME + '.es5';
  if (!config.minifyJs) {
    staticName += '.dev';
  }
  staticName += '.js';

  const readFilePromises: Promise<string>[] = [];

  // first load up all of the polyfill content
  [
    'template.js',
    'document-register-element.js',
    'object-assign.js',
    'promise.js',
    'fetch.js',
    'request-animation-frame.js',
    'closest.js',
    'performance-now.js'
  ].forEach(polyfillFile => {
    const staticName = sys.path.join('polyfills', polyfillFile);
    readFilePromises.push(sys.getClientCoreFile({ staticName: staticName }));
  });

  // also get the main core file
  readFilePromises.push(sys.getClientCoreFile({ staticName: staticName }));

  return Promise.all(readFilePromises).then(results => {
    // wrap the core content code
    // which is the last result in the array
    results[results.length - 1] = wrapCoreJs(config, [
      globalJsContent.join('\n'),
      results[results.length - 1]
    ].join('\n').trim());

    // concat the polyfills above the core content
    return results.join('\n').trim();
  });
}


export function wrapCoreJs(config: BuildConfig, jsContent: string) {
  const publicPath = getAppPublicPath(config);

  const output = [
    generatePreamble(config),
    `(function(Context,appNamespace,hydratedCssClass,publicPath){`,
    `"use strict";\n`,
    `var s=document.querySelector("script[data-core='${APP_CORE_FILENAME_PLACEHOLDER}'][data-path]");`,
    `if(s){publicPath=s.getAttribute('data-path');}\n`,
    jsContent.trim(),
    `\n})({},"${config.namespace}","${config.hydratedCssClass}","${publicPath}");`
  ].join('');

  return output;
}


export function getAppPublicPath(config: BuildConfig) {
  return normalizePath(
    config.sys.path.join(
      config.publicPath,
      getAppFileName(config)
    )
  ) + '/';
}


export const APP_CORE_FILENAME_PLACEHOLDER = '__APP_CORE_FILENAME__';
