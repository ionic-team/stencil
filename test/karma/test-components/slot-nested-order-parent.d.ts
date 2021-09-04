import type { Components, JSX } from "../test-dist/types/components";

interface SlotNestedOrderParent extends Components.SlotNestedOrderParent, HTMLElement {}
export const SlotNestedOrderParent: {
  prototype: SlotNestedOrderParent;
  new (): SlotNestedOrderParent;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
