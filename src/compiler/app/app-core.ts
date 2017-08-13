import { BuildConfig } from '../../util/interfaces';
import { CORE_NAME } from '../../util/constants';
import { generatePreamble, normalizePath } from '../util';


export function generateCore(config: BuildConfig, globalJsContent: string[]) {
  let staticName = CORE_NAME;
  if (config.devMode) {
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
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  const readFilePromises: Promise<string>[] = [];

  // first concat all of the polyfills
  [
    'document-register-element.js',
    'fetch.js',
    'performance-now.js'
  ].forEach(polyfillFile => {
    const staticName = sys.path.join('polyfills', polyfillFile);
    readFilePromises.push(sys.getClientCoreFile({ staticName: staticName }));
  });

  // concat the main core file
  readFilePromises.push(sys.getClientCoreFile({ staticName: staticName }));

  return Promise.all(readFilePromises).then(results => {
    const docRegistryPolyfillContent = results[0];
    const fetchPolyfillContent = results[1];
    const perfNowPolyfillContent = results[2];

    const coreContent = wrapCoreJs(config, [
      globalJsContent.join('\n'),
      results[3]
    ].join('\n').trim());

    // replace the default core with the project's namespace
    // concat the custom element polyfill and projects core code
    return [
      docRegistryPolyfillContent,
      fetchPolyfillContent,
      perfNowPolyfillContent,
      coreContent
    ].join('\n').trim();
  });
}


export function wrapCoreJs(config: BuildConfig, jsContent: string) {
  const publicPath = getAppPublicPath(config);

  const output = [
    generatePreamble(config),
    `(function(Context,appNamespace,publicPath){`,
    `"use strict";\n`,
    jsContent.trim(),
    `\n})({},"${config.namespace}","${publicPath}");`
  ].join('');

  return output;
}


export function getAppPublicPath(config: BuildConfig) {
  return normalizePath(
    config.sys.path.join(
      config.publicPath,
      config.namespace.toLowerCase()
    )
  ) + '/';
}


export function getAppFileName(config: BuildConfig) {
  return config.namespace.toLowerCase();
}
