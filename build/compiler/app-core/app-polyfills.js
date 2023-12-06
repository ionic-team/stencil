import { join } from '@utils';
export const getClientPolyfill = async (config, compilerCtx, polyfillFile) => {
    const polyfillFilePath = join(config.sys.getCompilerExecutingPath(), '..', '..', 'internal', 'client', 'polyfills', polyfillFile);
    return compilerCtx.fs.readFile(polyfillFilePath);
};
export const getAppBrowserCorePolyfills = async (config, compilerCtx) => {
    // read all the polyfill content, in this particular order
    const polyfills = INLINE_POLYFILLS.slice();
    const results = await Promise.all(polyfills.map((polyfillFile) => getClientPolyfill(config, compilerCtx, polyfillFile)));
    // concat the polyfills
    return results.join('\n').trim();
};
// order of the polyfills matters!! test test test
// actual source of the polyfills are found in /src/client/polyfills/
const INLINE_POLYFILLS = ['core-js.js', 'dom.js', 'es5-html-element.js', 'system.js'];
//# sourceMappingURL=app-polyfills.js.map