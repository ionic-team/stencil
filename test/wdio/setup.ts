// this is well justified!
// https://github.com/webdriverio/webdriverio/blob/51ac8482284ad34dea3cc899872397fb734de617/packages/wdio-browser-runner/src/browser/setup.ts#L13-L21
declare global {
  interface Window {
    __wdioSpec__: string;
  }
}

/**
 * load the testapp so that we don't have to import the components within the tests
 */
const testRequiresManualSetup =
  window.__wdioSpec__.includes('custom-elements-output-tag-class-different') ||
  window.__wdioSpec__.includes('custom-elements-delegates-focus') ||
  window.__wdioSpec__.includes('custom-elements-output') ||
  window.__wdioSpec__.includes('global-script');

/**
 * setup all components defined in tests except for those where we want ot manually setup
 * the components in the test
 */
if (!testRequiresManualSetup) {
  await import('./dist/testapp/testapp.esm.js');
}

/**
 * load the separate test app for the global script tests, if appropriate to do so
 */
if (window.__wdioSpec__.includes('global-script.test.tsx')) {
  await import('./www-global-script/build/testglobalscript.esm.js');
}
