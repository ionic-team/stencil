import * as d from '../../declarations';
import { getPolyfillsEsmBuildPath } from './app-file-naming';
import { pathJoin } from '../util';


export async function getAppBrowserCorePolyfills(config: d.Config) {
  // first load up all of the polyfill content
  const readFilePromises = INLINE_POLYFILLS.map(polyfillFile => {
    const staticName = config.sys.path.join('polyfills', 'es5', polyfillFile);
    return config.sys.getClientCoreFile({ staticName: staticName });
  });

  // read all the polyfill content, in this particular order
  const results = await Promise.all(readFilePromises);

  // concat the polyfills
  return results.join('\n').trim();
}


export async function copyEsmCorePolyfills(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const polyfillsBuildDir = getPolyfillsEsmBuildPath(config, outputTarget, 'es5');

  await POLYFILLS.map(async polyfillFile => {
    const staticName = config.sys.path.join('polyfills', 'esm', polyfillFile);
    const polyfillsContent = await config.sys.getClientCoreFile({ staticName: staticName });

    const polyfillDst = pathJoin(config, polyfillsBuildDir, polyfillFile);
    await compilerCtx.fs.writeFile(polyfillDst, polyfillsContent);
  });
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
  'url.js'
];

const POLYFILLS = [
  ...INLINE_POLYFILLS,
  'css-shim.js',
  'tslib.js'
];
