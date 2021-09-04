import type { Components, JSX } from "../test-dist/types/components";

interface SlotListLightRoot extends Components.SlotListLightRoot, HTMLElement {}
export const SlotListLightRoot: {
  prototype: SlotListLightRoot;
  new (): SlotListLightRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
