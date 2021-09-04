import type { Components, JSX } from "../test-dist/types/components";

interface SlotBasic extends Components.SlotBasic, HTMLElement {}
export const SlotBasic: {
  prototype: SlotBasic;
  new (): SlotBasic;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
