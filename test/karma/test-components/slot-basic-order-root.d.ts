import type { Components, JSX } from "../test-dist/types/components";

interface SlotBasicOrderRoot extends Components.SlotBasicOrderRoot, HTMLElement {}
export const SlotBasicOrderRoot: {
  prototype: SlotBasicOrderRoot;
  new (): SlotBasicOrderRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
