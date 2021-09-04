import type { Components, JSX } from "../test-dist/types/components";

interface SlotArrayBasic extends Components.SlotArrayBasic, HTMLElement {}
export const SlotArrayBasic: {
  prototype: SlotArrayBasic;
  new (): SlotArrayBasic;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
