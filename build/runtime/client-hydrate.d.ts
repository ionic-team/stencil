import type * as d from '../declarations';
/**
 * Entrypoint of the client-side hydration process. Facilitates calls to hydrate the
 * document and all its nodes.
 *
 * This process will also reconstruct the shadow root and slot DOM nodes for components using shadow DOM.
 *
 * @param hostElm The element to hydrate.
 * @param tagName The element's tag name.
 * @param hostId The host ID assigned to the element by the server.
 * @param hostRef The host reference for the element.
 */
export declare const initializeClientHydrate: (hostElm: d.HostElement, tagName: string, hostId: string, hostRef: d.HostRef) => void;
/**
 * Recursively locate any comments representing an original location for a node in a node's
 * children or shadowRoot children.
 *
 * @param node The node to search.
 * @param orgLocNodes A map of the original location annotation and the current node being searched.
 */
export declare const initializeDocumentHydrate: (node: d.RenderNode, orgLocNodes: d.PlatformRuntime['$orgLocNodes$']) => void;
