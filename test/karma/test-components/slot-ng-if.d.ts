import type { Components, JSX } from "../test-dist/types/components";

interface SlotNgIf extends Components.SlotNgIf, HTMLElement {}
export const SlotNgIf: {
  prototype: SlotNgIf;
  new (): SlotNgIf;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
