import type { Components, JSX } from "../test-dist/types/components";

interface SlotArrayTop extends Components.SlotArrayTop, HTMLElement {}
export const SlotArrayTop: {
  prototype: SlotArrayTop;
  new (): SlotArrayTop;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
