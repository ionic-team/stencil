import { MockNode } from '@stencil/core/mock-doc';
export declare function jestSetupTestFramework(): void;
/**
 * Recursively removes all child nodes of a passed node starting with the
 * furthest descendant and then moving back up the DOM tree.
 *
 * @param node The mocked DOM node that will be removed from the DOM
 */
export declare function removeDomNodes(node: MockNode | undefined | null): void;
