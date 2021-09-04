import type { Components, JSX } from "../test-dist/types/components";

interface SlotReplaceWrapperRoot extends Components.SlotReplaceWrapperRoot, HTMLElement {}
export const SlotReplaceWrapperRoot: {
  prototype: SlotReplaceWrapperRoot;
  new (): SlotReplaceWrapperRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
