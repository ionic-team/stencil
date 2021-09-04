import type { Components, JSX } from "../test-dist/types/components";

interface SlotFallback extends Components.SlotFallback, HTMLElement {}
export const SlotFallback: {
  prototype: SlotFallback;
  new (): SlotFallback;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
