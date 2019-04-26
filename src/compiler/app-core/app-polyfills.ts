import * as d from '../../declarations';


export async function getAppBrowserCorePolyfills(config: d.Config) {
  // first load up all of the polyfill content
  const readFilePromises = INLINE_POLYFILLS.map(polyfillFile => {
    const staticName = config.sys.path.join('polyfills', polyfillFile);
    return config.sys.getClientCoreFile({ staticName: staticName });
  });

  // read all the polyfill content, in this particular order
  const results = await Promise.all(readFilePromises);

  // concat the polyfills
  return results.join('\n').trim();
}


// order of the polyfills matters!! test test test
// actual source of the polyfills are found in /src/client/polyfills/
const INLINE_POLYFILLS = [
  'array.js',
  'object.js',
  'string.js',
  'dom.js',
  'es5-html-element.js',
  'promise.js',
  'map.js',
  'fetch.js',
  'url.js',
  'system.js',
  'css-shim.js'
];
