import * as d from '@declarations';
import { sys } from '@sys';


export async function getAppBrowserCorePolyfills() {
  // first load up all of the polyfill content
  const readFilePromises = INLINE_POLYFILLS.map(polyfillFile => {
    const staticName = sys.path.join('polyfills', 'es5', polyfillFile);
    return sys.getClientCoreFile({ staticName: staticName });
  });

  // read all the polyfill content, in this particular order
  const results = await Promise.all(readFilePromises);

  // concat the polyfills
  return results.join('\n').trim();
}


export function copyEsmCorePolyfills(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const polyfillsBuildDir = sys.path.join(outputTarget.buildDir, 'esm', 'es5', 'polyfills');

  return Promise.all(
    POLYFILLS.map(async polyfillFile => {
      const staticName = sys.path.join('polyfills', 'esm', polyfillFile);
      const polyfillsContent = await sys.getClientCoreFile({ staticName: staticName });

      const polyfillDst = sys.path.join(polyfillsBuildDir, polyfillFile);
      await compilerCtx.fs.writeFile(polyfillDst, polyfillsContent);
    })
  );
}



// order of the polyfills matters!! test test test
// actual source of the polyfills are found in /src/client/polyfills/
const INLINE_POLYFILLS = [
  'dom.js',
  'array.js',
  'object.js',
  'string.js',
  'promise.js',
  'map.js',
  'fetch.js',
  'url.js',
  'system.js',
];

const POLYFILLS = [
  ...INLINE_POLYFILLS,
  'css-shim.js',
  'tslib.js'
];
