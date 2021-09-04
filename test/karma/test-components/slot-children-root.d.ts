import type { Components, JSX } from "../test-dist/types/components";

interface SlotChildrenRoot extends Components.SlotChildrenRoot, HTMLElement {}
export const SlotChildrenRoot: {
  prototype: SlotChildrenRoot;
  new (): SlotChildrenRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
