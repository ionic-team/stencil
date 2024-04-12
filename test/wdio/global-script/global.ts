declare global {
  interface Window {
    __testStart: number;
  }
}

import { defineCustomElements } from '../test-components/index.js';

export default async function () {
  window.__testStart = Date.now();

  /**
   * register custom elements in global script and test later in
   * `test/wdio/global-script/global-script.test.tsx` if components
   * can be loaded
   */
  defineCustomElements();

  return new Promise((resolve) => setTimeout(() => resolve('done!'), 1000));
}
