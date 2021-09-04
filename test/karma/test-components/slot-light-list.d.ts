import type { Components, JSX } from "../test-dist/types/components";

interface SlotLightList extends Components.SlotLightList, HTMLElement {}
export const SlotLightList: {
  prototype: SlotLightList;
  new (): SlotLightList;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
