/**
 * Perform Hot Module Replacement for a given Stencil component (identified
 * uniquely via its tag name) in the DOM tree rooted at a given starting
 * element.
 *
 * @param element the root element within which to do Hot Module Replacement
 * @param versionId the current HMR version ID
 * @param hmrTagNames an out param containing a list of updated Stencil
 * component tag names
 * @returns a reference to the tag name array
 */
export declare const hmrComponents: (element: Element, versionId: string, hmrTagNames: string[]) => string[];
