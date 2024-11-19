import type { Components, JSX } from "../test-dist/types/components";

interface NodeGlobals extends Components.NodeGlobals, HTMLElement {}
export const NodeGlobals: {
  prototype: NodeGlobals;
  new (): NodeGlobals;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
