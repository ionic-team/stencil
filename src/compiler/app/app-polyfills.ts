import { Config } from '../../declarations';


export async function getAppCorePolyfills(config: Config) {
  // first load up all of the polyfill content
  const readFilePromises = POLYFILLS.map(polyfillFile => {
    const staticName = config.sys.path.join('polyfills', polyfillFile);
    return config.sys.getClientCoreFile({ staticName: staticName });
  });

  // read all the polyfill content, in this particular order
  const results = await Promise.all(readFilePromises);

  // concat the polyfills
  return results.join('\n').trim();
}


// order of the polyfills matters!! test test test
// actual source of the polyfills are found in /scripts/polyfills/
// during the end user's app build they're read from /dist/client/polyfills/
const POLYFILLS = [
  'template.js',
  'document-register-element.js',
  'array-find.js',
  'array-includes.js',
  'object-assign.js',
  'string-startswith.js',
  'string-endswith.js',
  'promise.js',
  'fetch.js',
  'request-animation-frame.js',
  'closest.js',
  'performance-now.js',
  'remove-element.js'
];
