import type { Components, JSX } from "../test-dist/types/components";

interface NodeGlobals extends Components.NodeGlobals, HTMLElement {}
export const NodeGlobals: {
  prototype: NodeGlobals;
  new (): NodeGlobals;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
