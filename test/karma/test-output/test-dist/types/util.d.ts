/**
 * A namespace for custom type definitions used in a portion of the testing suite
 */
export declare namespace SomeTypes {
  type Number = number;
  type String = string;
}
/**
 * Utilities for creating a test bed to execute HTML rendering tests against
 */
type DomTestUtilities = {
  /**
   * Create and render the HTML at the provided url
   * @param url a location on disk of a file containing the HTML to load
   * @param waitForStencilReadyMs an optional period to wait for a Stencil application to be loaded, in milliseconds.
   * @returns the fully rendered HTML to test against
   */
  setupDom: (url: string, waitForStencilReadyMs?: number) => Promise<HTMLElement>;
  /**
   * Clears the test bed of any existing HTML
   */
  tearDownDom: () => void;
  /**
   * Clears the test bed of existing CSS set during test execution
   */
  tearDownStylesScripts: () => void;
};
/**
 * Create setup and teardown methods for DOM based tests. All DOM based tests are created within an application
 * 'test bed' that is managed by this function.
 * @param document a `Document` compliant entity where tests may be rendered
 * @returns utilities to set up the DOM and tear it down within the test bed
 */
export declare function setupDomTests(document: Document): DomTestUtilities;
/**
 * Wait for the component to asynchronously update
 * @param timeoutMs the time (in milliseconds) to wait for the component to update
 */
export declare function waitForChanges(timeoutMs?: number): Promise<unknown>;
export {};
