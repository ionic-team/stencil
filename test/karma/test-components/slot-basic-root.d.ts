import type { Components, JSX } from "../test-dist/types/components";

interface SlotBasicRoot extends Components.SlotBasicRoot, HTMLElement {}
export const SlotBasicRoot: {
  prototype: SlotBasicRoot;
  new (): SlotBasicRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
