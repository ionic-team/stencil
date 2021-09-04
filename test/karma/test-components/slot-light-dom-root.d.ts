import type { Components, JSX } from "../test-dist/types/components";

interface SlotLightDomRoot extends Components.SlotLightDomRoot, HTMLElement {}
export const SlotLightDomRoot: {
  prototype: SlotLightDomRoot;
  new (): SlotLightDomRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
