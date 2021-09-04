import type { Components, JSX } from "../test-dist/types/components";

interface SlotMapOrderRoot extends Components.SlotMapOrderRoot, HTMLElement {}
export const SlotMapOrderRoot: {
  prototype: SlotMapOrderRoot;
  new (): SlotMapOrderRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
