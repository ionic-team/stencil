import type { Components, JSX } from "../test-dist/types/components";

interface NodeResolution extends Components.NodeResolution, HTMLElement {}
export const NodeResolution: {
  prototype: NodeResolution;
  new (): NodeResolution;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
