import type { Components, JSX } from "../test-dist/types/components";

interface SlotNoDefault extends Components.SlotNoDefault, HTMLElement {}
export const SlotNoDefault: {
  prototype: SlotNoDefault;
  new (): SlotNoDefault;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
