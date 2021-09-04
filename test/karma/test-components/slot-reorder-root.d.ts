import type { Components, JSX } from "../test-dist/types/components";

interface SlotReorderRoot extends Components.SlotReorderRoot, HTMLElement {}
export const SlotReorderRoot: {
  prototype: SlotReorderRoot;
  new (): SlotReorderRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
