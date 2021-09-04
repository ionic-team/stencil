import type { Components, JSX } from "../test-dist/types/components";

interface SlotArrayComplex extends Components.SlotArrayComplex, HTMLElement {}
export const SlotArrayComplex: {
  prototype: SlotArrayComplex;
  new (): SlotArrayComplex;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
