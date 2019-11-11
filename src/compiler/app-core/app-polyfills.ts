import * as d from '../../declarations';


export async function getClientPolyfill(config: d.Config, polyfillFile: string) {
  const staticName = config.sys.path.join('polyfills', polyfillFile);
  return config.sys.getClientCoreFile({ staticName: staticName });
}

export async function getAppBrowserCorePolyfills(config: d.Config) {
  // read all the polyfill content, in this particular order
  const results = await Promise.all(
    INLINE_POLYFILLS
      .map(polyfillFile => getClientPolyfill(config, polyfillFile))
  );

  // concat the polyfills
  return results.join('\n').trim();
}


// order of the polyfills matters!! test test test
// actual source of the polyfills are found in /src/client/polyfills/
const INLINE_POLYFILLS = [
  'promise.js',
  'core-js.js',
  'dom.js',
  'es5-html-element.js',
  'system.js',
  'css-shim.js'
];
