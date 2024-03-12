import { browser } from '@wdio/globals';

/**
 * A namespace for custom type definitions used in a portion of the testing suite
 */
export declare namespace SomeTypes {
  type Number = number;
  type String = string;
}

export function isSafari() {
  return (browser.capabilities as WebdriverIO.Capabilities).browserName.toLowerCase() === 'safari';
}
